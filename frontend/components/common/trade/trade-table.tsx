import * as React from "react"
import { TransactionTableList } from "@/components/common/general/table-data"
import { TableFilter } from "@/components/common/general/table-filter"
import { TransactionProvider, useTransaction } from "@/contexts/transaction-context"
import type { OrderStatus, OrderType, TransactionQueryParams } from "@/lib/services"
import { formatLocalDate } from "@/lib/utils"

/**
 * 活动表格组件
 * 
 * 支持类型、状态、时间范围筛选的活动记录显示（支持分页）
 */
export function TradeTable({ type }: { type?: OrderType }) {
  /* 计算最近一个月的时间范围 */
  const getLastMonthRange = React.useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = new Date(today)
    start.setDate(start.getDate() - 29)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return {
      startTime: formatLocalDate(start),
      endTime: formatLocalDate(tomorrow)
    }
  }, [])

  /* 获取时间范围 */
  const { startTime, endTime } = getLastMonthRange()

  return (
    <TransactionProvider defaultParams={{ page_size: 20, startTime, endTime }}>
      <TransactionList initialType={type} />
    </TransactionProvider>
  )
}

/**
 * 活动列表组件
 * 
 * 显示交用户活动记录
 */
function TransactionList({ initialType }: { initialType?: OrderType }) {
  const {
    transactions,
    total,
    currentPage,
    totalPages,
    loading,
    error,
    fetchTransactions,
    loadMore,
  } = useTransaction()

  /* 筛选状态 */
  const [selectedTypes, setSelectedTypes] = React.useState<OrderType[]>(initialType ? [initialType] : [])
  const [selectedStatuses, setSelectedStatuses] = React.useState<OrderStatus[]>([])
  const [selectedQuickSelection, setSelectedQuickSelection] = React.useState<string | null>("最近 1 个月")
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date } | null>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const from = new Date(today)
    from.setDate(from.getDate() - 29)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return { from, to: tomorrow }
  })

  /* 清空所有筛选 */
  const clearAllFilters = React.useCallback(() => {
    setSelectedTypes(initialType ? [initialType] : [])
    setSelectedStatuses([])
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const from = new Date(today)
    from.setDate(from.getDate() - 29)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    setDateRange({ from, to: tomorrow })
    setSelectedQuickSelection("最近 1 个月")

    /* 重新获取数据 */
    fetchTransactions({
      page: 1,
      page_size: 20,
      type: initialType,
      startTime: formatLocalDate(from),
      endTime: formatLocalDate(tomorrow),
    })
  }, [initialType, fetchTransactions])

  /* 当筛选条件改变时，重新加载数据 */
  React.useEffect(() => {
    const params: TransactionQueryParams = {
      page: 1,
      page_size: 20,
      type: selectedTypes.length > 0 ? selectedTypes[0] : undefined,
      status: selectedStatuses.length > 0 ? selectedStatuses[0] : undefined,
      startTime: dateRange ? formatLocalDate(dateRange.from) : undefined,
      endTime: dateRange ? (() => {
        const endDate = new Date(dateRange.to)
        endDate.setDate(endDate.getDate() + 1)
        return formatLocalDate(endDate)
      })() : undefined,
    }

    fetchTransactions(params)
  }, [fetchTransactions, dateRange, selectedTypes, selectedStatuses])

  /* 当initialType改变时，更新筛选状态 */
  React.useEffect(() => {
    if (initialType) {
      setSelectedTypes([initialType])
    } else {
      setSelectedTypes([])
    }
  }, [initialType])

  /* 加载更多 */
  const handleLoadMore = React.useCallback(() => {
    loadMore()
  }, [loadMore])

  return (
    <div className="flex flex-col space-y-4">
      <TableFilter
        enabledFilters={{
          type: initialType === undefined,
          status: true,
          timeRange: true
        }}
        selectedTypes={selectedTypes}
        selectedStatuses={selectedStatuses}
        selectedTimeRange={dateRange}
        selectedQuickSelection={selectedQuickSelection}
        onTypeChange={setSelectedTypes}
        onStatusChange={setSelectedStatuses}
        onTimeRangeChange={setDateRange}
        onQuickSelectionChange={setSelectedQuickSelection}
        onClearAll={clearAllFilters}
      />

      <TransactionTableList
        loading={loading}
        error={error}
        transactions={transactions}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        onRetry={() => fetchTransactions({ page: 1 })}
        onLoadMore={handleLoadMore}
      />
    </div>
  )
}
