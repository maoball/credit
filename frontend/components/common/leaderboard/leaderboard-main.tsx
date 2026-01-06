"use client"

import * as React from "react"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useLeaderboard } from "@/hooks/use-leaderboard"
import { LeaderboardPodium } from "@/components/common/leaderboard/leaderboard-podium"
import { LeaderboardTable } from "@/components/common/leaderboard/leaderboard-table"
import { UserRankCard } from "@/components/common/leaderboard/user-rank-card"
import { LoadingState } from "@/components/layout/loading"

/**
 * 排行榜主组件
 * 
 * 负责组装排行榜的各个子组件，包括领奖台、用户排名卡片和排名列表
 */
export function LeaderboardMain() {
  const {
    items,
    myRank,
    loading,
    loadingMore,
    myRankLoading,
    hasMore,
    loadNextPage,
  } = useLeaderboard()

  if (loading && items.length === 0) {
    return <LoadingState title="加载中" description="正在获取排行榜数据..." />
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">全局排行榜</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-primary gap-1">
              <HelpCircle className="h-4 w-4" />
              排行榜是如何运作的?
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>排行榜是如何运作的?</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>参与社区活动、进行积分流转，都会获得积分。排行榜每几分钟就会更新一次。保持活跃，积极参与积分活动来提高自己的排名！</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <LeaderboardPodium items={items.slice(0, 3)} loading={loading} />

      <UserRankCard data={myRank} loading={myRankLoading} className="my-4" />

      <LeaderboardTable
        items={items.slice(3)}
        loading={loading || loadingMore}
        currentUserId={myRank?.user.user_id}
        onLoadMore={loadNextPage}
        hasMore={hasMore}
        startRank={4}
      />
    </div>
  )
}
