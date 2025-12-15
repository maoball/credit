import Link from "next/link"
import { Button } from "@/components/ui/button"

/**
 * 在线商品组件
 * 
 * 显示在线商品功能和管理入口
 */
export function Online() {
  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-6 py-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold mb-4 text-foreground">创建在线商品</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            创建和管理您的在线商品支付链接，无需编写代码即可开始销售商品和服务。
          </p>
          <Link href="/merchant/online">
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 rounded-md shadow-sm">
              前往创建
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
