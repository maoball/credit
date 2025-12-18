import * as React from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Eye, EyeOff, RefreshCcw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DisputeService, TransactionService } from "@/lib/services"
import type { DisputeWithOrder, Order } from "@/lib/services"
import { RefundReviewDialog, CancelDisputeDialog } from "@/components/common/general/table-data"
import { CountingNumber } from '@/components/animate-ui/primitives/texts/counting-number'
import { useDisputeData } from "@/hooks/use-dispute"
import { DisputeDialog } from "@/components/common/home/dispute-dialog"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

/**
 * 创建争议对象
 * @param dispute 争议对象
 * @param type 争议类型
 * @returns 争议对象
 */
const createDisputeOrder = (dispute: DisputeWithOrder, type: 'receive' | 'payment'): Order => ({
  id: dispute.order_id,
  dispute_id: dispute.id,
  type,
  status: 'disputing' as const,
  order_no: '',
  order_name: dispute.order_name,
  merchant_order_no: '',
  payer_user_id: 0,
  payee_user_id: 0,
  payer_username: '',
  payee_username: dispute.payee_username,
  amount: dispute.amount,
  remark: '',
  client_id: '',
  trade_time: '',
  expires_at: '',
  created_at: '',
  updated_at: '',
  payment_type: ''
})

/**
 * 争议列表骨架屏
 * 用于显示争议列表的加载状态
 * 
 * @returns 争议列表骨架屏
 */
const DisputeListSkeleton = () => (
  <div className="space-y-1">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={`skeleton-${ index }`}
        className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50"
      >
        <div className="flex-1 min-w-0">
          <Skeleton className="h-3 w-32 mb-1" />
          <Skeleton className="h-2.5 w-20" />
        </div>
        <div className="flex items-center gap-1 ml-2">
          <Skeleton className="h-5 w-5 p-1 rounded-full bg-muted" />
        </div>
      </div>
    ))}
  </div>
)

/**
 * 争议列表数据骨架屏
 */
const PaymentListSkeleton = () => (
  <div className="space-y-1">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={`payment-skeleton-${ index }`}
        className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50"
      >
        <div className="flex-1 min-w-0">
          <Skeleton className="h-3 w-32 mb-1" />
          <Skeleton className="h-2.5 w-20" />
        </div>
        <div className="flex items-center gap-1 ml-2">
          <Skeleton className="h-5 w-16 rounded" />
        </div>
      </div>
    ))}
  </div>
)

/**
 * 获取活动状态显示文本
 */
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    success: '成功',
    pending: '待处理',
    failed: '失败',
    expired: '已过期',
    disputing: '争议中',
    refund: '已退回',
    refused: '已拒绝'
  }
  return statusMap[status] || status
}

/**
 * 获取活动状态样式
 */
const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'success':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'failed':
    case 'refused':
      return 'destructive'
    default:
      return 'outline'
  }
}

/**
 * 活动卡片
 * 用于显示活动列表数据
 * 
 * @returns 活动列表卡片
 */
function PaymentCard({ onViewAll }: { onViewAll: () => void }) {
  const [isHidden, setIsHidden] = React.useState(false)
  const [payments, setPayments] = React.useState<Order[]>([])
  const [loading, setLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)

  const fetchPayments = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await TransactionService.getTransactions({
        page: 1,
        page_size: 10,
        type: 'payment',
        status: 'success'
      })
      setPayments(response.orders)
      setTotal(response.total)
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const handleRefresh = () => {
    fetchPayments()
  }

  return (
    <Card className="bg-background border-0 shadow-none rounded-lg min-h-[200px] flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <CardTitle className="text-sm font-medium">活动</CardTitle>
            <p className="font-semibold">{loading ? '-' : <CountingNumber number={total} decimalPlaces={0} />}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0"
              onClick={() => setIsHidden(!isHidden)}
            >
              {isHidden ? (
                <EyeOff className="h-3 w-3 text-muted-foreground" />
              ) : (
                <Eye className="h-3 w-3 text-muted-foreground" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={handleRefresh}>
              <RefreshCcw className="size-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative flex-1 -mt-4">
        <ScrollArea className="h-46">
          {loading ? (
            <PaymentListSkeleton />
          ) : payments.length > 0 ? (
            <div className="space-y-1">
              {payments.map((payment) => (
                <div
                  key={`payment-${ payment.id }`}
                  className="flex items-center justify-between py-1 px-2 rounded-md bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate leading-tight">
                      {payment.order_name}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      LDC {payment.amount}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Badge variant={getStatusVariant(payment.status)} className="text-[10px] px-1.5 py-0">
                      {getStatusText(payment.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-46 flex items-center justify-center">
              <p className="text-muted-foreground text-xs">暂无积分活动记录</p>
            </div>
          )}
        </ScrollArea>

        {isHidden && (
          <div className="absolute inset-0 backdrop-blur-md bg-background/30 rounded-lg flex items-center justify-center">
            <EyeOff className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}
      </CardContent>
      <CardFooter className="h-8 items-end">
        <div className="flex border-t pt-4 items-center justify-between text-xs text-muted-foreground w-full">
          <span>更新时间：{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
          <Button
            variant="link"
            className="px-0 h-4 text-xs text-blue-600"
            disabled={loading}
            onClick={onViewAll}
          >
            查看全部
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

/**
 * 积分总额卡片
 * 用于显示积分总额数据（所有成功活动的积分总额）
 * 
 * @returns 积分总额列表卡片
 */
function TotalCard() {
  const [total, setTotal] = React.useState<number>(0)
  const [loading, setLoading] = React.useState(true)

  const fetchTotal = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await TransactionService.getTransactions({
        page: 1,
        page_size: 100,
        status: 'success'
      })

      const totalAmount = response.orders.reduce((sum, order) => {
        return sum + parseFloat(order.amount || '0')
      }, 0)

      setTotal(totalAmount)
    } catch (error) {
      console.error('Failed to fetch total:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchTotal()
  }, [fetchTotal])

  const handleRefresh = () => {
    fetchTotal()
  }

  return (
    <Card className="bg-background border-0 shadow-none rounded-lg min-h-[200px] flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-medium">积分</CardTitle>
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={handleRefresh}>
            <RefreshCcw className="size-4 text-muted-foreground" />
          </Button>
        </div>
        <div>
          <div className="text-xl font-semibold">
            {loading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <>LDC <CountingNumber number={total} decimalPlaces={2} /></>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-[120px] w-full flex items-center justify-center border border-dashed rounded-lg">
          <p className="text-xs text-muted-foreground">图表暂时不可用</p>
        </div>
      </CardContent>
      <CardFooter className="border-t h-8 items-end">
        <div className="flex items-center justify-between text-xs text-muted-foreground w-full">
          <span>更新时间：{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

/**
 * 净积分值卡片
 * 用于显示净积分值数据（积分收益 - 积分消耗）
 * 
 * @returns 净积分值列表卡片
 */
function NetVolumeCard() {
  const [netAmount, setNetAmount] = React.useState<number>(0)
  const [loading, setLoading] = React.useState(true)

  const fetchNetVolume = React.useCallback(async () => {
    try {
      setLoading(true)

      /* 获取积分收益总额 */
      const receiveResponse = await TransactionService.getTransactions({
        page: 1,
        page_size: 100,
        type: 'receive',
        status: 'success'
      })

      const receiveTotal = receiveResponse.orders.reduce((sum, order) => {
        return sum + parseFloat(order.amount || '0')
      }, 0)

      /* 获取积分消耗总额 */
      const paymentResponse = await TransactionService.getTransactions({
        page: 1,
        page_size: 100,
        type: 'payment',
        status: 'success'
      })

      const paymentTotal = paymentResponse.orders.reduce((sum, order) => {
        return sum + parseFloat(order.amount || '0')
      }, 0)

      /* 计算净积分值 */
      setNetAmount(receiveTotal - paymentTotal)
    } catch (error) {
      console.error('Failed to fetch net volume:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchNetVolume()
  }, [fetchNetVolume])

  const handleRefresh = () => {
    fetchNetVolume()
  }

  return (
    <Card className="bg-background border-0 shadow-none rounded-lg min-h-[200px] flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-medium">净积分值</CardTitle>
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={handleRefresh}>
            <RefreshCcw className="size-4 text-muted-foreground" />
          </Button>
        </div>
        <div>
          <div className="text-xl font-semibold">
            {loading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <>
                LDC <CountingNumber number={Math.abs(netAmount)} decimalPlaces={2} />
                {netAmount < 0 && <span className="text-destructive ml-1">(赤字)</span>}
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-[120px] w-full flex items-center justify-center border border-dashed rounded-lg">
          <p className="text-xs text-muted-foreground">图表暂时不可用</p>
        </div>
      </CardContent>
      <CardFooter className="border-t h-8 items-end">
        <div className="flex items-center justify-between text-xs text-muted-foreground w-full">
          <span>更新时间：{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

/**
 * 积分消耗最多的佬友卡片
 * 用于显示积分消耗最多的佬友数据
 *
 * @returns 积分消耗最多的佬友卡片
 */
function TopCustomersCard() {
  return (
    <Card className="bg-background border-0 shadow-none rounded-lg min-h-[200px] flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium">积分收益排行</CardTitle>
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
            <RefreshCcw className="size-4 text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
      <CardFooter className="border-t h-8 items-end">
        <div className="flex items-center justify-between text-xs text-muted-foreground w-full">
          <span>更新时间：上午12:29</span>
        </div>
      </CardFooter>
    </Card>
  )
}

/**
 * 待处理的争议卡片
 * 用于显示待处理的争议数据
 * 
 * @returns 待处理的争议卡片
 */
function PendingDisputesCard({ onViewAll }: { onViewAll: () => void }) {
  const { disputes, loading, handleRefresh, refetchData } = useDisputeData({
    fetchFn: (params) => DisputeService.listMerchantDisputes(params)
  })

  return (
    <Card className="bg-background border-0 shadow-none rounded-lg min-h-[200px] flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <CardTitle className="text-sm font-medium">待处理的争议</CardTitle>
            <p className="font-semibold">{loading ? '-' : <CountingNumber number={disputes.count} decimalPlaces={0} />}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={handleRefresh}>
            <RefreshCcw className="size-4 text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 -mt-4">
        <ScrollArea className="h-46">
          {loading ? (
            <DisputeListSkeleton />
          ) : disputes.list.length > 0 ? (
            <div className="space-y-1">
              {disputes.list.map((dispute) => (
                <div
                  key={`merchant-${ dispute.id }`}
                  className="flex items-center justify-between py-1 px-2 rounded-md bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate leading-tight">
                      {dispute.order_name}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      {dispute.payee_username}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <RefundReviewDialog
                      order={createDisputeOrder(dispute, 'receive')}
                      onSuccess={refetchData}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-46 flex items-center justify-center">
              <p className="text-muted-foreground text-xs">暂无待处理的积分活动争议</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="h-8 items-end">
        <div className="flex border-t pt-4 items-center justify-between text-xs text-muted-foreground w-full">
          <span>更新时间：{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
          <Button
            variant="link"
            className="px-0 h-4 text-xs text-blue-600"
            disabled={loading}
            onClick={onViewAll}
          >
            查看全部
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

/**
 * 我发起的争议卡片
 * 用于显示我发起的争议数据
 * 
 * @returns 我发起的争议卡片
 */
function MyDisputesCard({ onViewAll }: { onViewAll: () => void }) {
  const { disputes, loading, handleRefresh, refetchData } = useDisputeData({
    fetchFn: (params) => DisputeService.listDisputes(params)
  })

  return (
    <Card className="bg-background border-0 shadow-none rounded-lg min-h-[200px] flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <CardTitle className="text-sm font-medium">我发起的争议</CardTitle>
            <p className="font-semibold">{loading ? '-' : <CountingNumber number={disputes.count} decimalPlaces={0} />}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={handleRefresh}>
            <RefreshCcw className="size-4 text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 -mt-4">
        <ScrollArea className="h-46">
          {loading ? (
            <DisputeListSkeleton />
          ) : disputes.list.length > 0 ? (
            <div className="space-y-1">
              {disputes.list.map((dispute) => (
                <div
                  key={`user-${ dispute.id }`}
                  className="flex items-center justify-between py-1 px-2 rounded-md bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate leading-tight">
                      {dispute.order_name}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      积分活动发起者正在处理争议
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <CancelDisputeDialog
                      order={createDisputeOrder(dispute, 'payment')}
                      onSuccess={refetchData}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-46 flex items-center justify-center text-muted-foreground text-xs">
              暂无我发起的积分活动争议
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="h-8 items-end">
        <div className="flex border-t pt-4 items-center justify-between text-xs text-muted-foreground w-full">
          <span>更新时间：{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
          <Button
            variant="link"
            className="px-0 h-4 text-xs text-blue-600"
            disabled={loading}
            onClick={onViewAll}
          >
            查看全部
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

/**
 * 概览面板组件
 * 用于显示概览面板
 * 
 * @returns 概览面板组件
 */
export function OverviewPanel() {
  const router = useRouter()
  const [disputeDialogOpen, setDisputeDialogOpen] = React.useState(false)
  const [disputeDialogMode, setDisputeDialogMode] = React.useState<'pending' | 'my-disputes'>('pending')

  const handleViewAllPending = () => {
    setDisputeDialogMode('pending')
    setDisputeDialogOpen(true)
  }

  const handleViewAllMyDisputes = () => {
    setDisputeDialogMode('my-disputes')
    setDisputeDialogOpen(true)
  }

  const handleViewAllPayments = () => {
    router.push('/trade?type=payment')
  }

  return (
    <>
      <div className="bg-muted rounded-lg p-2 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <PaymentCard onViewAll={handleViewAllPayments} />
          <TotalCard />
          <NetVolumeCard />
          <TopCustomersCard />
          <PendingDisputesCard onViewAll={handleViewAllPending} />
          <MyDisputesCard onViewAll={handleViewAllMyDisputes} />
        </div>
      </div>

      <DisputeDialog
        mode={disputeDialogMode}
        open={disputeDialogOpen}
        onOpenChange={setDisputeDialogOpen}
      />
    </>
  )
}
