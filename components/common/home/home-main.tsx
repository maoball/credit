"use client"

import * as React from "react"
import { DataPanel } from "./data-panel"
import { OverviewTool } from "./overview-tool"
import { OverviewPanel } from "./overview-panel"

export function HomeMain() {
  const [dateRange, setDateRange] = React.useState({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date()
  })

  return (
    <div className="py-6 space-y-8">
      {/* 标题部分 */}
      <div>
        <h1 className="text-2xl font-semibold border-b border-border pb-4">今天</h1>
      </div>

      {/* 数据区域 */}
      <DataPanel />

      {/* 您的概览 */}
      <div className="pt-6">
        <h2 className="text-2xl font-semibold pb-4">您的概览</h2>
        
        {/* 控制工具 */}
        <OverviewTool 
          onDateRangeChange={setDateRange}
        />
        
        {/* 概览面板 */}
        <OverviewPanel 
          dateRange={dateRange}
        />
      </div>
    </div>
  )
}
