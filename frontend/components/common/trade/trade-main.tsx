"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Receive } from "./receive"
import { Payment } from "./payment"
import { Transfer } from "./transfer"
import { AllActivity } from "./all-activity"

export function TradeMain() {
  return (
    <div className="py-6 space-y-0">
      {/* 标题部分 */}
      <div className="pb-2">
        <h1 className="text-2xl font-semibold">交易</h1>
      </div>

      {/* 标签导航 */}
      <Tabs defaultValue="receive" className="w-full">
        <div>
          <TabsList className="flex p-0 gap-4 rounded-none w-full bg-transparent justify-start border-b border-border">
            <TabsTrigger 
              value="receive" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-0 data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] bg-transparent rounded-none border-0 border-b-2 border-transparent px-0 text-sm font-bold text-muted-foreground data-[state=active]:text-[#6366f1] -mb-[2px] relative hover:text-foreground transition-colors flex-none"
            >
              收款
            </TabsTrigger>
            <TabsTrigger 
              value="payment" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-0 data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] bg-transparent rounded-none border-0 border-b-2 border-transparent px-0 text-sm font-bold text-muted-foreground data-[state=active]:text-[#6366f1] -mb-[2px] relative hover:text-foreground transition-colors flex-none"
            >
              付款
            </TabsTrigger>
            <TabsTrigger 
              value="transfer" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-0 data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] bg-transparent rounded-none border-0 border-b-2 border-transparent px-0 text-sm font-bold text-muted-foreground data-[state=active]:text-[#6366f1] -mb-[2px] relative hover:text-foreground transition-colors flex-none"
            >
              转账
            </TabsTrigger>
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-0 data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] bg-transparent rounded-none border-0 border-b-2 border-transparent px-0 text-sm font-bold text-muted-foreground data-[state=active]:text-[#6366f1] -mb-[2px] relative hover:text-foreground transition-colors flex-none"
            >
              所有活动
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 收款标签内容 */}
        <TabsContent value="receive">
          <Receive />
        </TabsContent>

        {/* 付款标签内容 */}
        <TabsContent value="payment">
          <Payment />
        </TabsContent>

        {/* 转账标签内容 */}
        <TabsContent value="transfer">
          <Transfer />
        </TabsContent>

        {/* 所有活动标签内容 */}
        <TabsContent value="all">
          <AllActivity />
        </TabsContent>
      </Tabs>
    </div>
  )
}

