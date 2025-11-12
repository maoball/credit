"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import services, { type MerchantAPIKey, isCancelError } from "@/lib/services"
import { MerchantSelector } from "./merchant-selector"
import { MerchantInfo } from "./merchant-info"
import { MerchantData } from "./merchant-data"
import { MerchantCreate } from "./merchant-create"

/**
 * 商户主页面组件
 * 负责组装商户中心的各个子组件
 */
export function MerchantMain() {
  const [apiKeys, setApiKeys] = useState<MerchantAPIKey[]>([])
  const [selectedKeyId, setSelectedKeyId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // 获取当前选中的 API Key
  const selectedKey = apiKeys.find(key => key.id === selectedKeyId) || null

  // 加载 API Keys
  const loadAPIKeys = async () => {
    try {
      setLoading(true)
      const data = await services.merchant.listAPIKeys()
      const validKeys = Array.isArray(data) ? data.filter(key => key != null) : []
      setApiKeys(validKeys)
    } catch (error: any) {
      if (isCancelError(error)) {
        return
      }
      toast.error('加载失败', {
        description: error.message || '无法加载 API Keys'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAPIKeys()
  }, [])

  useEffect(() => {
    if (apiKeys.length > 0 && !selectedKeyId) {
      setSelectedKeyId(apiKeys[0].id)
    }
  }, [apiKeys, selectedKeyId])

  const handleCreateSuccess = (newKey: MerchantAPIKey) => {
    setApiKeys([newKey, ...apiKeys])
    setSelectedKeyId(newKey.id)
  }

  const handleDelete = async (id: number) => {
    try {
      await services.merchant.deleteAPIKey(id)
      toast.success('删除成功')
      
      const newKeys = apiKeys.filter(key => key && key.id !== id)
      setApiKeys(newKeys)
      
      if (selectedKeyId === id) {
        setSelectedKeyId(newKeys.length > 0 ? newKeys[0].id : null)
      }
    } catch (error: any) {
      toast.error('删除失败', {
        description: error.message || '无法删除应用'
      })
    }
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between border-b border-border pb-2 mb-6">
        <h1 className="text-2xl font-semibold">商户中心</h1>
        <MerchantCreate onSuccess={handleCreateSuccess} />
      </div>

      {/* 加载状态 */}
      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : apiKeys.length === 0 ? (
        /* 空状态 */
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold mb-2">商户应用列表为空</h2>
            <p className="text-muted-foreground mb-6">
              请创建您的第一个商户应用，以便开始接入支付功能
            </p>
            <MerchantCreate
              onSuccess={handleCreateSuccess}
              trigger={
                <Button className="bg-[#6366f1] hover:bg-[#5558e3] text-white">
                  开始创建
                </Button>
              }
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <MerchantSelector
            apiKeys={apiKeys}
            selectedKeyId={selectedKeyId}
            onSelect={setSelectedKeyId}
          />

          {selectedKey && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MerchantData apiKey={selectedKey} />
              </div>
              
              <div className="lg:col-span-1">
                <MerchantInfo apiKey={selectedKey} onDelete={handleDelete}/>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
