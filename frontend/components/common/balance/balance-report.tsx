"use client"

import * as React from "react"

/**
 * 报告项类型
 */
interface ReportItem {
  /** 图标 */
  icon: React.ComponentType<{ className?: string }>
  /** 标题 */
  title: string
  /** 描述 */
  description: string
  /** 点击回调 */
  onClick?: () => void
}

interface BalanceReportProps {
  /** 自定义报告列表 */
  reports?: ReportItem[]
}

/**
 * 余额报告组件
 * 显示可下载或查看的报告列表
 *
 * @example
 * ```tsx
 * <BalanceReport
 *   reports={[
 *     {
 *       icon: FileTextIcon,
 *       title: "余额摘要",
 *       description: "2025年10月",
 *       onClick: () => console.log("下载余额摘要")
 *     }
 *   ]}
 * />
 * ```
 */
export function BalanceReport({ reports }: BalanceReportProps) {
  // 默认报告列表为空
  const defaultReports: ReportItem[] = []

  const reportList = reports || defaultReports

  if (reportList.length === 0) {
    return (
      <div className="space-y-4">
        <div className="font-semibold">报告</div>
        <div className="text-sm text-muted-foreground">暂无报告</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="font-semibold">报告</div>
      <div className="space-y-2">
        {reportList.map((report, index) => (
          <ReportItem key={index} report={report} />
        ))}
      </div>
    </div>
  )
}

/**
 * 报告项组件
 */
function ReportItem({ report }: { report: ReportItem }) {
  const Icon = report.icon

  return (
    <button
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left group"
      onClick={report.onClick}
    >
      <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-muted/80 transition-colors">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{report.title}</div>
        <div className="text-xs text-muted-foreground">{report.description}</div>
      </div>
    </button>
  )
}

