"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Settings, Plus, CalendarIcon, ChevronDown } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

interface OverviewToolProps {
  onDateRangeChange?: (dateRange: { from: Date; to: Date }) => void
}

export function OverviewTool({ onDateRangeChange }: OverviewToolProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  
  // 计算最近7天
  const getLastDays = (days: number) => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - days)
    return { from, to }
  }
  
  const [dateRange, setDateRange] = React.useState<{
    from: Date
    to: Date
  }>(getLastDays(7))
  
  // 当日期范围改变时通知父组件
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range)
    onDateRangeChange?.(range)
  }


  const quickSelections = [
    { label: "今天", getValue: () => {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      tomorrow.setMilliseconds(-1) // 设置为当天的最后一毫秒
      return { from: today, to: tomorrow }
    }},
    { label: "最近 7 天", getValue: () => getLastDays(7) },
    { label: "最近 4 周", getValue: () => getLastDays(28) },
    { label: "最近 6 个月", getValue: () => {
      const to = new Date()
      const from = new Date()
      from.setMonth(from.getMonth() - 6)
      return { from, to }
    }},
    { label: "本月至今", getValue: () => {
      const to = new Date()
      const from = new Date(to.getFullYear(), to.getMonth(), 1)
      return { from, to }
    }},
    { label: "本季至今", getValue: () => {
      const to = new Date()
      const quarter = Math.floor(to.getMonth() / 3)
      const from = new Date(to.getFullYear(), quarter * 3, 1)
      return { from, to }
    }},
    { label: "所有时间", getValue: () => {
      const to = new Date()
      const from = new Date(2020, 0, 1) // 从2020年开始
      return { from, to }
    }},
  ]

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap pb-6 border-b">
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="!h-6 !min-h-6 text-xs font-bold rounded-full border border-muted-foreground/20 shadow-none !px-2.5 !py-1 gap-2 inline-flex items-center w-auto hover:bg-accent"
          >
            <span className="text-muted-foreground text-xs font-bold">日期范围</span>
            <Separator orientation="vertical" className="h-2.5" />
            <CalendarIcon className="h-3 w-3 text-muted-foreground" />
            <span className="text-blue-600 text-xs font-bold">
              {format(dateRange.from, "yyyy年MM月dd日", { locale: zhCN })} → {format(dateRange.to, "yyyy年MM月dd日", { locale: zhCN })}
            </span>
            <ChevronDown className="h-3 w-3 text-muted-foreground/50" />
          </button>

          {isCalendarOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsCalendarOpen(false)}
              />
              <div className="absolute top-full mt-2 left-0 z-50 bg-popover border rounded-lg shadow-lg flex">
                {/* 左侧快速选择 */}
                <div className="w-32 space-y-1 pt-7 px-3">
                  {quickSelections.map((selection) => (
                    <button
                      key={selection.label}
                      onClick={() => {
                        const range = selection.getValue()
                        handleDateRangeChange(range)
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs rounded-md hover:bg-accent transition-colors cursor-pointer"
                    >
                      {selection.label}
                    </button>
                  ))}
                </div>
                
                {/* 右侧日历 */}
                <div className="p-4">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => {
                      if (range?.from) {
                        let to = range.to || range.from
                        if (!range.to || range.from.getTime() === to.getTime()) {
                          to = new Date(range.from)
                          to.setHours(23, 59, 59, 999)
                        }
                        handleDateRangeChange({ from: range.from, to })
                      }
                    }}
                    numberOfMonths={2}
                    locale={zhCN}
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCalendarOpen(false)}
                      className="h-8 text-xs"
                    >
                      清空
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsCalendarOpen(false)}
                      className="h-8 text-xs"
                    >
                      使用
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-7 w-7 rounded-full border-muted-foreground/20">
          <Plus className="h-3 w-3" />
        </Button>
        <Button variant="outline" size="icon" className="h-7 w-7 rounded-full border-muted-foreground/20">
          <Settings className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

