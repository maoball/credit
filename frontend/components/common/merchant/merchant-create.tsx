"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import services, { type MerchantAPIKey, type CreateAPIKeyRequest } from "@/lib/services"

interface MerchantCreateProps {
  /** 创建成功回调 */
  onSuccess: (newKey: MerchantAPIKey) => void
  /** 触发按钮 */
  trigger?: React.ReactNode
}

/**
 * 商户创建组件
 * 负责创建新应用的表单和验证逻辑
 */
export function MerchantCreate({ onSuccess, trigger }: MerchantCreateProps) {
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  // 表单状态
  const [formData, setFormData] = useState<CreateAPIKeyRequest>({
    app_name: '',
    app_homepage_url: '',
    app_description: '',
    redirect_uri: '',
  })

  // 验证 URL 格式
  const isValidUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  // 重置表单
  const resetForm = () => {
    setFormData({
      app_name: '',
      app_homepage_url: '',
      app_description: '',
      redirect_uri: '',
    })
  }

  // 验证表单
  const validateForm = (): { valid: boolean; error?: string } => {
    // 验证必填项
    if (!formData.app_name || !formData.app_homepage_url || !formData.redirect_uri) {
      return { valid: false, error: '请填写所有必填项' }
    }

    // 验证应用名称长度
    if (formData.app_name.length > 20) {
      return { valid: false, error: '应用名称不能超过 20 个字符' }
    }

    // 验证应用主页 URL 格式
    if (!isValidUrl(formData.app_homepage_url)) {
      return {
        valid: false,
        error: '应用主页 URL 格式不正确，请输入完整的 URL（例如：https://example.com）'
      }
    }

    // 验证回调 URI 格式
    if (!isValidUrl(formData.redirect_uri)) {
      return {
        valid: false,
        error: '回调 URI 格式不正确，请输入完整的 URL（例如：https://example.com/callback）'
      }
    }

    // 验证应用描述长度
    if (formData.app_description && formData.app_description.length > 100) {
      return { valid: false, error: '应用描述不能超过 100 个字符' }
    }

    return { valid: true }
  }

  // 创建应用
  const handleCreate = async () => {
    // 验证表单
    const validation = validateForm()
    if (!validation.valid) {
      toast.error('表单验证失败', {
        description: validation.error
      })
      return
    }

    try {
      setCreating(true)
      const newKey = await services.merchant.createAPIKey(formData)

      // 检查返回的数据是否有效
      if (!newKey || !newKey.id) {
        throw new Error('创建成功但返回数据无效')
      }

      toast.success('创建成功', {
        description: '新应用已创建，请妥善保管您的 Client Secret'
      })

      // 调用成功回调
      onSuccess(newKey)

      // 关闭对话框
      setOpen(false)

      // 重置表单
      resetForm()
    } catch (error: any) {
      toast.error('创建失败', {
        description: error.message || '无法创建应用'
      })
    } finally {
      setCreating(false)
    }
  }

  // 处理对话框关闭
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !creating) {
      resetForm()
    }
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#6366f1] hover:bg-[#5558e3] text-white h-7 text-xs">
            创建新应用
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>创建新应用</DialogTitle>
          <DialogDescription>
            创建一个新的应用来接入支付功能，请仔细填写以下信息
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="app_name">
              应用名称 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="app_name"
              placeholder="您的应用名称"
              maxLength={20}
              value={formData.app_name}
              onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
              disabled={creating}
            />
            <p className="text-xs text-muted-foreground">
              最多 20 个字符，用于标识您的应用
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="app_homepage_url">
              应用主页 URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="app_homepage_url"
              type="url"
              placeholder="https://pay.linux.do"
              maxLength={100}
              value={formData.app_homepage_url}
              onChange={(e) => setFormData({ ...formData, app_homepage_url: e.target.value })}
              disabled={creating}
            />
            <p className="text-xs text-muted-foreground">
              应用主页 URL， 必须为包含 http:// 或 https:// 的完整 URL
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="app_description">应用描述</Label>
            <Input
              id="app_description"
              placeholder="您的应用描述"
              maxLength={100}
              value={formData.app_description}
              onChange={(e) => setFormData({ ...formData, app_description: e.target.value })}
              disabled={creating}
            />
            <p className="text-xs text-muted-foreground">
              选填，最多 100 个字符，用于描述您的应用
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="redirect_uri">
              回调 URI <span className="text-red-500">*</span>
            </Label>
            <Input
              id="redirect_uri"
              type="url"
              placeholder="https://pay.linux.do/callback"
              maxLength={100}
              value={formData.redirect_uri}
              onChange={(e) => setFormData({ ...formData, redirect_uri: e.target.value })}
              disabled={creating}
            />
            <p className="text-xs text-muted-foreground">
              支付完成后的回调地址，必须为包含 http:// 或 https:// 的完整 URL
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={creating} className="h-7 text-xs">取消</Button>
          </DialogClose>
          <Button
            onClick={(e) => {
              e.preventDefault()
              handleCreate()
            }}
            disabled={creating}
            className="bg-[#6366f1] hover:bg-[#5558e3] h-7 text-xs"
          >
            {creating ? <><Spinner/> 创建中</> : '创建'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

