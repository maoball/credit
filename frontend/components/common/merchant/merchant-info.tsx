"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Copy, Eye, EyeOff, Trash2, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import type { MerchantAPIKey } from "@/lib/services"
import Link from "next/link"

interface MerchantInfoProps {
  /** 当前选中的 API Key */
  apiKey: MerchantAPIKey
  /** 删除回调 */
  onDelete: (id: number) => void
}

/**
 * 商户信息组件
 * 显示商户的凭证信息（Client ID 和 Secret）
 */
export function MerchantInfo({ apiKey, onDelete }: MerchantInfoProps) {
  const [showClientId, setShowClientId] = useState(false)
  const [showClientSecret, setShowClientSecret] = useState(false)

  // 复制到剪贴板
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} 已复制`)
    }).catch(() => {
      toast.error('复制失败')
    })
  }

  // 格式化日期
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const maskText = (text: string, showLength: number = 8) => {
    if (text.length <= showLength * 2) return text
    return `${text.substring(0, showLength)}${'•'.repeat(20)}${text.substring(text.length - showLength)}`
  }

  return (
    <div className="space-y-4 sticky top-6">
      <div>
        <h2 className="text-sm font-semibold mb-3">应用信息</h2>
        <div className="border rounded-lg divide-y">
          <div className="px-3 py-2 flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground block mb-1">应用名称</label>
            <p className="text-xs text-muted-foreground truncate">{apiKey.app_name}</p>
          </div>

          {apiKey.app_description && (
            <div className="px-3 py-2 flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground block mb-1">应用描述</label>
              <p className="text-xs text-muted-foreground truncate">{apiKey.app_description}</p>
            </div>
          )}

          <div className="px-3 py-2 flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground block mb-1">创建时间</label>
            <p className="text-xs text-muted-foreground">{formatDate(apiKey.created_at)}</p>
          </div>

          <div className="px-3 py-2 flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground block mb-1">应用地址</label>
            <Link
              href={apiKey.app_homepage_url}
              target="_blank"
              className="text-xs text-[#6366f1] hover:underline flex items-center gap-1 break-all"
            >
              {apiKey.app_homepage_url}
              <ExternalLink className="h-3 w-3 shrink-0" />
            </Link>
          </div>

          <div className="px-3 py-2 flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground block mb-1">回调 URI</label>
            <Link
              href={apiKey.redirect_uri}
              target="_blank"
              className="text-xs text-[#6366f1] hover:underline flex items-center gap-1 break-all"
            >
              {apiKey.redirect_uri}
              <ExternalLink className="h-3 w-3 shrink-0" />
            </Link>
          </div>

        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3">API 凭证</h2>
        <div className="border rounded-lg px-3 py-2 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium">Client ID</label>
              <span className="text-[10px] text-muted-foreground">客户端标识</span>
            </div>
            <div className="flex items-center bg-muted/50 pl-2 h-8">
              <code className="text-[10px] font-mono flex-1 overflow-x-auto leading-relaxed">
                {showClientId ? apiKey.client_id : maskText(apiKey.client_id, 8)}
              </code>
              <Button
                variant="ghost"
                className="p-1 w-6 h-6"
                onClick={() => setShowClientId(!showClientId)}
              >
                {showClientId ? (
                  <EyeOff className="size-3" />
                ) : (
                  <Eye className="size-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                className="p-1 w-6 h-6"
                onClick={() => copyToClipboard(apiKey.client_id, 'Client ID')}
              >
                <Copy className="size-3" />
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium">Client Secret</label>
              <span className="text-[10px] text-muted-foreground">客户端密钥</span>
            </div>
            <div className="flex items-center bg-muted/50 pl-2 h-8">
              <code className="text-[10px] font-mono flex-1 overflow-x-auto">
                {showClientSecret ? apiKey.client_secret : '•'.repeat(40)}
              </code>
              <Button
                variant="ghost"
                className="p-1 w-6 h-6"
                onClick={() => setShowClientSecret(!showClientSecret)}
              >
                {showClientSecret ? (
                  <EyeOff className="size-3" />
                ) : (
                  <Eye className="size-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => copyToClipboard(apiKey.client_secret, 'Client Secret')}
                className="p-1 w-6 h-6"
              >
                <Copy className="size-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 危险操作 */}
      <div>
        <h2 className="text-sm font-semibold mb-3">删除应用</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="text-xs h-7"
            >
              <Trash2 className="size-3" />
              删除
            </Button>
          </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除应用</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除应用 "{apiKey.app_name}" 吗？
              此操作将永久删除该应用的所有凭证和配置，且无法恢复。
              使用此应用凭证的所有集成将立即失效。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(apiKey.id)}
              className="bg-red-500 hover:bg-red-600"
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
  )
}

