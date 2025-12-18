import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Users, TrendingUp, Activity, Globe } from "lucide-react";
import { CountingNumber } from "@/components/animate-ui/primitives/texts/counting-number";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartData = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 205 },
  { month: "Mar", desktop: 337 },
  { month: "Apr", desktop: 233 },
  { month: "May", desktop: 309 },
  { month: "Jun", desktop: 414 },
];

const chartConfig = {
  desktop: {
    label: "Growth",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export interface StatsSectionProps {
  className?: string;
}

/**
 * Stats Section - 数据统计展示
 * 使用 Bento Grid 布局
 */
export const StatsSection = React.memo(function StatsSection({ className }: StatsSectionProps) {
  return (
    <section className={cn("relative z-10 w-full min-h-screen lg:h-screen flex flex-col justify-center py-12 lg:py-0 px-4 lg:px-6 bg-transparent snap-start overflow-hidden", className)}>
      <div className="container mx-auto max-w-6xl">

        <div className="text-center mb-10 lg:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4 lg:mb-6"
          >
            用数据说话，见证非凡增长
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed"
          >
            实时数据洞察，助您做出明智决策，轻松掌握每一笔积分活动动态。
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[140px] lg:auto-rows-[180px]">

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 md:row-span-2 rounded-3xl 5 backdrop-blur-md border p-6 flex flex-col justify-between overflow-hidden relative group transition-colors duration-500"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">积分活动趋势</span>
              </div>
              <div className="text-4xl font-bold tracking-tight flex items-baseline gap-1">
                Coming Soon
              </div>
            </div>

            <div className="absolute inset-0 top-20 pt-10 px-0">
              <ChartContainer config={chartConfig} className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
                <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" hide />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="url(#fillDesktop)"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-1 md:row-span-1 rounded-3xl bg-blue-500/10 backdrop-blur-md border border-blue-500/20 p-6 flex flex-col justify-end relative overflow-hidden hovering-scale"
          >
            <div className="absolute top-4 right-4 text-blue-500/40">
              <Users className="w-12 h-12" />
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-1 flex items-baseline gap-1">
                <span
                  className="inline-block tabular-nums min-w-[86px] text-right"
                >
                  <CountingNumber number={30000} inViewOnce />
                </span>
                <span className="text-4xl align-baseline">+</span>
              </div>
              <div className="text-sm text-muted-foreground font-medium">活跃用户</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-1 md:row-span-1 rounded-3xl bg-green-500/10 backdrop-blur-md border border-green-500/20 p-6 flex flex-col justify-end relative overflow-hidden hovering-scale"
          >
            <div className="absolute top-4 right-4 text-green-500/40">
              <TrendingUp className="w-12 h-12" />
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-1 flex items-baseline gap-1">
                <CountingNumber number={300} inViewOnce />%
              </div>
              <div className="text-sm text-muted-foreground font-medium">活动增长</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 md:row-span-1 rounded-3xl bg-white/5 backdrop-blur-md border border-primary/10 p-6 relative overflow-hidden group transition-colors"
          >
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="absolute top-6 left-4">
                <div className="text-4xl md:text-5xl font-bold text-foreground tracking-tight flex items-baseline">
                  <CountingNumber number={100} inViewOnce decimalPlaces={0} />M+
                </div>
                <span className="text-sm font-medium text-muted-foreground">年度总流动规模</span>
              </div>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-10 transition-opacity duration-500 pointer-events-none">
              <Globe className="w-48 h-48 text-orange-500" strokeWidth={0.5} />
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] transition-colors pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
});
