"use client"

import * as React from "react"
import { useBalance } from "@/hooks/use-balance"
import { BalanceSummary } from "./balance-summary"
import { BalanceTable } from "./balance-table"
import { BalanceReport } from "./balance-report"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorPage } from "@/components/common/status/error"

/**
 * 余额主页面组件
 * 负责组装余额页面的各个子组件，并管理数据加载状态
 * 
 * @example
 * ```tsx
 * <BalanceMain />
 * ```
 */
export function BalanceMain() {
  const { balance, loading, error, refetch } = useBalance()

  if (loading) {
    return <BalanceLoadingSkeleton />
  }

  if (error) {
    return <ErrorPage error={error} onRetry={refetch} />
  }

  const displayBalance = balance || { total: 0, available: 0, pending: 0 }

  return (
    <div className="py-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <h1 className="text-2xl">
          <span className="font-semibold">余额</span>
          <span className="pl-2">LDC</span>
          <span className="pl-2">{displayBalance.total.toFixed(2)}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-4">
          <BalanceSummary balance={displayBalance} currency="LDC" />
          <BalanceTable />
        </div>

        <div className="lg:col-span-1">
          <BalanceReport />
        </div>
      </div>
    </div>
  )
}

/**
 * 余额加载骨架屏组件
 */
function BalanceLoadingSkeleton() {
  return (
    <div className="py-6 space-y-4">
      {/* 页面标题 */}
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <h1 className="text-2xl flex items-center gap-2">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-16" />
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* 左侧主要内容区域 */}
        <div className="lg:col-span-3 space-y-4">
          {/* BalanceSummary 骨架屏 */}
          <div className="space-y-4">
            <div className="font-semibold">
              <Skeleton className="h-5 w-20" />
            </div>

            {/* 进度条 */}
            <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 rounded-sm overflow-hidden flex">
              <Skeleton className="h-full w-3/5 rounded-none bg-[#6366F1]/20" />
              <Skeleton className="h-full w-2/5 rounded-none bg-gray-400/20" />
            </div>

            {/* 列表 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-medium pb-2 border-b">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>

              <div className="flex justify-between items-center font-bold text-sm pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-3 rounded-xs bg-[#6366F1]/80" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>

              <div className="flex justify-between items-center font-bold text-sm pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-3 rounded-xs bg-gray-400/80" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>

          <BalanceTable />
        </div>

        {/* 右侧报告区域 */}
        <div className="lg:col-span-1">
          <div>
            <h2 className="text-xl font-semibold pb-4">
              <Skeleton className="h-6 w-12" />
            </h2>

            <div className="text-sm text-muted-foreground">
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}