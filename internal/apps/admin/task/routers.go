/*
Copyright 2025 linux.do

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package task

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hibiken/asynq"
	"github.com/linux-do/credit/internal/db"
	"github.com/linux-do/credit/internal/logger"
	"github.com/linux-do/credit/internal/model"
	"github.com/linux-do/credit/internal/task"
	"github.com/linux-do/credit/internal/task/scheduler"
	"github.com/linux-do/credit/internal/util"
	"gorm.io/gorm"
)

// ListTaskTypes 获取支持的任务类型列表
// @Tags admin
// @Produce json
// @Success 200 {object} util.ResponseAny
// @Router /api/v1/admin/tasks/types [get]
func ListTaskTypes(c *gin.Context) {
	c.JSON(http.StatusOK, util.OK(task.DispatchableTasks))
}

// DispatchTaskRequest 下发任务请求
type DispatchTaskRequest struct {
	TaskType  string     `json:"task_type" binding:"required"`
	StartTime *time.Time `json:"start_time"`
	EndTime   *time.Time `json:"end_time"`
	UserID    *uint64    `json:"user_id"`
}

// DispatchTask 下发任务
// @Tags admin
// @Accept json
// @Produce json
// @Param request body DispatchTaskRequest true "request body"
// @Success 200 {object} util.ResponseAny
// @Router /api/v1/admin/tasks/dispatch [post]
func DispatchTask(c *gin.Context) {
	var req DispatchTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, util.Err(err.Error()))
		return
	}

	meta := task.GetTaskMeta(req.TaskType)
	if meta == nil {
		c.JSON(http.StatusBadRequest, util.Err(InvalidTaskType))
		return
	}

	var taskInfo *asynq.Task
	var taskID string

	switch req.TaskType {
	case task.TaskTypeOrderSync:
		if req.StartTime != nil && req.EndTime != nil {
			if req.EndTime.Before(*req.StartTime) {
				c.JSON(http.StatusBadRequest, util.Err(InvalidTimeRange))
				return
			}
			payload, _ := json.Marshal(map[string]interface{}{
				"start_time": req.StartTime,
				"end_time":   req.EndTime,
			})
			taskInfo = asynq.NewTask(meta.AsynqTask, payload)
			taskID = fmt.Sprintf("manual_%s_%s_%s", req.TaskType,
				req.StartTime.Format("20060102150405"),
				req.EndTime.Format("20060102150405"))
		} else {
			taskInfo = asynq.NewTask(meta.AsynqTask, nil)
			taskID = fmt.Sprintf("manual_%s", req.TaskType)
		}

	case task.TaskTypeUserGamification:
		if req.UserID == nil || *req.UserID == 0 {
			taskInfo = asynq.NewTask(task.UpdateUserGamificationScoresTask, nil)
			taskID = fmt.Sprintf("manual_%s", req.TaskType)
		} else {
			payload, _ := json.Marshal(map[string]interface{}{
				"user_id": *req.UserID,
			})
			taskInfo = asynq.NewTask(meta.AsynqTask, payload)
			taskID = fmt.Sprintf("manual_%s_user_%d", req.TaskType, *req.UserID)
		}
	default:
		taskInfo = asynq.NewTask(meta.AsynqTask, nil)
		taskID = fmt.Sprintf("manual_%s", req.TaskType)
	}

	_, err := scheduler.AsynqClient.Enqueue(
		taskInfo,
		asynq.TaskID(taskID),
		asynq.MaxRetry(meta.MaxRetry),
		asynq.Queue(meta.Queue),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, util.Err(fmt.Sprintf("%s: %v", TaskDispatchFailed, err)))
		return
	}

	c.JSON(http.StatusOK, util.OKNil())
}

// HandleCleanupUnusedUploads 处理清理未使用上传文件的定时任务
func HandleCleanupUnusedUploads(ctx context.Context, t *asynq.Task) error {
	logger.InfoF(ctx, "开始清理未使用的上传文件任务")
	cleanupUnusedUploads(ctx)
	logger.InfoF(ctx, "未使用上传文件清理任务完成")
	return nil
}

// cleanupUnusedUploads 清理超过1小时未使用的上传文件
func cleanupUnusedUploads(ctx context.Context) {
	const batchSize = 100 // 每批处理100个文件
	var lastID uint64 = 0
	var totalProcessed int = 0
	var totalDeleted int = 0

	// 计算1小时前的时间
	oneHourAgo := time.Now().Add(-1 * time.Hour)

	for {
		// 使用游标分页查询未使用且超过1小时的上传记录
		var unusedUploads []model.Upload
		if err := db.DB(ctx).
			Where("id > ? AND status = ? AND created_at < ?", lastID, model.UploadStatusPending, oneHourAgo).
			Order("id ASC").
			Limit(batchSize).
			Find(&unusedUploads).Error; err != nil {
			logger.ErrorF(ctx, "查询未使用的上传文件失败: %v", err)
			return
		}

		// 没有更多数据，退出循环
		if len(unusedUploads) == 0 {
			break
		}

		logger.InfoF(ctx, "本批次找到 %d 个需要清理的上传文件", len(unusedUploads))

		// 处理每个未使用的上传文件
		for _, upload := range unusedUploads {
			totalProcessed++

			if err := db.DB(ctx).Transaction(func(tx *gorm.DB) error {
				// 更新上传记录状态
				if err := tx.Model(&model.Upload{}).
					Where("id = ? AND status = ?", upload.ID, model.UploadStatusPending).
					Update("status", model.UploadStatusDeleted).Error; err != nil {
					return err
				}

				// 删除文件
				if err := os.Remove(upload.FilePath); err != nil {
					if !os.IsNotExist(err) {
						return err
					}
				}

				return nil
			}); err != nil {
				logger.ErrorF(ctx, "清理上传文件失败 [ID:%d]: %v", upload.ID, err)
				lastID = upload.ID
				continue
			}

			totalDeleted++
			logger.InfoF(ctx, "成功清理上传文件 [ID:%d, Path:%s, Size:%d bytes]", upload.ID, upload.FilePath, upload.FileSize)

			// 更新游标
			lastID = upload.ID
		}
	}

	if totalDeleted > 0 {
		logger.InfoF(ctx, "清理任务完成，共处理 %d 个文件，成功删除 %d 个", totalProcessed, totalDeleted)
	} else {
		logger.InfoF(ctx, "没有需要清理的上传文件")
	}
}
