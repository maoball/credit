"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, CreditCard } from "lucide-react"
import type { MerchantAPIKey } from "@/lib/services"

interface MerchantDataProps {
  /** 当前选中的 API Key */
  apiKey: MerchantAPIKey
}

/**
 * 商户数据组件
 * 显示应用的收款数据和统计信息
 */
export function MerchantData({ apiKey }: MerchantDataProps) {
  // 模拟数据 - 实际应该从 API 获取
  const stats = [
    {
      title: "总收款金额",
      value: "¥128,456.78",
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      title: "订单总数",
      value: "1,234",
      change: "+8.2%",
      trend: "up" as const,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "成功率",
      value: "98.5%",
      change: "+2.1%",
      trend: "up" as const,
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      title: "活跃用户",
      value: "856",
      change: "-3.2%",
      trend: "down" as const,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
  ]

  const recentOrders = [
    {
      id: "ORD-2024-001",
      amount: "¥299.00",
      status: "success",
      time: "2分钟前",
      customer: "用户 A",
    },
    {
      id: "ORD-2024-002",
      amount: "¥1,299.00",
      status: "success",
      time: "15分钟前",
      customer: "用户 B",
    },
    {
      id: "ORD-2024-003",
      amount: "¥599.00",
      status: "pending",
      time: "1小时前",
      customer: "用户 C",
    },
    {
      id: "ORD-2024-004",
      amount: "¥899.00",
      status: "success",
      time: "2小时前",
      customer: "用户 D",
    },
    {
      id: "ORD-2024-005",
      amount: "¥199.00",
      status: "failed",
      time: "3小时前",
      customer: "用户 E",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusMap = {
      success: { label: "成功", class: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" },
      pending: { label: "处理中", class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400" },
      failed: { label: "失败", class: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400" },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold mb-3">数据概览</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
            const trendColor = stat.trend === "up" ? "text-green-600" : "text-red-600"

            return (
              <div key={index} className="rounded-lg p-4 bg-muted/50">
                <div className="flex items-center justify-between mb-4">
                  <div className={`rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
                    <TrendIcon className="h-3.5 w-3.5" />
                    <span className="font-medium">{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">最近订单</h2>
        </div>
        <div className="border rounded-lg">
          <div className="divide-y">
            {recentOrders.map((order, index) => (
              <div
                key={index}
                className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.customer} · {order.time}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm">{order.amount}</p>
                  </div>
                </div>
                <div className="ml-4 shrink-0">
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="border rounded-lg p-5 text-left hover:border-[#6366f1] hover:bg-[#6366f1]/5 transition-all group">
            <h3 className="font-medium text-sm mb-1.5 group-hover:text-[#6366f1]">创建测试订单</h3>
            <p className="text-xs text-muted-foreground">
              快速创建一个测试订单来验证集成
            </p>
          </button>
          <button className="border rounded-lg p-5 text-left hover:border-[#6366f1] hover:bg-[#6366f1]/5 transition-all group">
            <h3 className="font-medium text-sm mb-1.5 group-hover:text-[#6366f1]">查看日志</h3>
            <p className="text-xs text-muted-foreground">
              查看 API 请求日志和错误信息
            </p>
          </button>
          <button className="border rounded-lg p-5 text-left hover:border-[#6366f1] hover:bg-[#6366f1]/5 transition-all group">
            <h3 className="font-medium text-sm mb-1.5 group-hover:text-[#6366f1]">下载报表</h3>
            <p className="text-xs text-muted-foreground">
              导出交易数据和财务报表
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}

