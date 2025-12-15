"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionTableList } from "@/components/common/general/table-data"
import { TransactionProvider, useTransaction } from "@/contexts/transaction-context"
import type { OrderType } from "@/lib/services"

/** 标签触发器样式 */
const TAB_TRIGGER_STYLES =
  "data-[state=active]:bg-transparent " +
  "data-[state=active]:shadow-none " +
  "data-[state=active]:border-0 " +
  "data-[state=active]:border-b-2 " +
  "data-[state=active]:border-indigo-500 " +
  "bg-transparent " +
  "rounded-none " +
  "border-0 " +
  "border-b-2 " +
  "border-transparent " +
  "px-0 " +
  "text-sm " +
  "font-bold " +
  "text-muted-foreground " +
  "data-[state=active]:text-indigo-500 " +
  "-mb-[2px] " +
  "relative " +
  "hover:text-foreground " +
  "transition-colors " +
  "flex-none"

/** 标签配置 - 数据驱动渲染 */
const TABS = [
  { value: "receive" as const, label: "收款" },
  { value: "payment" as const, label: "付款" },
  { value: "transfer" as const, label: "转账" },
  { value: "community" as const, label: "社区划转" },
  { value: "online" as const, label: "在线商品" },
  { value: "all" as const, label: "所有活动" },
] as const

/**
 * 余额活动表格组件
 * 
 * 显示不同类型的交易记录,支持多标签切换和分页加载
 */
export function BalanceTable() {
  const [activeTab, setActiveTab] = React.useState<OrderType | "all">("all")

  // 计算最近30天的时间范围
  const timeRange = React.useMemo(() => {
    const now = new Date()
    const endTime = now.toISOString()
    const startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    return { startTime, endTime }
  }, [])

  const handleTabChange = React.useCallback((value: string) => {
    setActiveTab(value as OrderType | "all")
  }, [])

  return (
    <div>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        {/* 标签列表 */}
        <TabsList className="flex p-0 gap-4 rounded-none w-full bg-transparent justify-start border-b border-border">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={TAB_TRIGGER_STYLES}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* 交易列表内容 */}
        <div className="mt-2">
          <TransactionProvider
            defaultParams={{
              page_size: 20,
              startTime: timeRange.startTime,
              endTime: timeRange.endTime,
            }}
          >
            <TransactionList
              type={activeTab === "all" ? undefined : activeTab}
            />
          </TransactionProvider>
        </div>
      </Tabs>
    </div>
  )
}

/**
 * 交易列表组件
 * 
 * 负责获取和显示交易数据
 */
function TransactionList({ type }: { type?: OrderType }) {
  const {
    transactions,
    total,
    currentPage,
    totalPages,
    loading,
    error,
    lastParams,
    fetchTransactions,
    loadMore,
  } = useTransaction()

  /** 当交易类型变化时重新加载数据 */
  React.useEffect(() => {
    fetchTransactions({
      page: 1,
      type,
      startTime: lastParams.startTime,
      endTime: lastParams.endTime,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  /** 处理加载更多 */
  const handleLoadMore = React.useCallback(() => {
    loadMore()
  }, [loadMore])

  /** 处理重试 */
  const handleRetry = React.useCallback(() => {
    fetchTransactions({ page: 1 })
  }, [fetchTransactions])

  return (
    <TransactionTableList
      loading={loading}
      error={error}
      transactions={transactions}
      total={total}
      currentPage={currentPage}
      totalPages={totalPages}
      onRetry={handleRetry}
      onLoadMore={handleLoadMore}
    />
  )
}
