import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Globe, Zap, Shield, Code, Activity, Headphones, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "极速流通",
    description: "流通快速响应，无需繁琐流程，积分秒级到账。",
    className: "lg:col-span-2 lg:row-span-1"
  },
  {
    icon: Globe,
    title: "全球网络",
    description: "覆盖全球国家和地区，高效流通。",
    className: "lg:col-span-1 lg:row-span-1"
  },
  {
    icon: Shield,
    title: "安全防护",
    description: "多重防护措施，全方位保障积分安全。",
    className: "lg:col-span-1 lg:row-span-1"
  },
  {
    icon: Activity,
    title: "实时监控",
    description: "多维度可视化数据看板，实时监控活动状态。",
    className: "lg:col-span-1 lg:row-span-1"
  },
  {
    icon: Headphones,
    title: "7x24 支持",
    description: "专业团队全天候待命，随时为您提供支持。",
    className: "lg:col-span-1 lg:row-span-1"
  },
  {
    icon: Code,
    title: "开发者友好",
    description: "提供优雅的 RESTful API，集成变得前所未有的简单，无需繁琐配置。",
    className: "lg:col-span-2 lg:row-span-1"
  }
];

export interface FeaturesSectionProps {
  className?: string;
}

/**
 * Features Section - 功能特性展示
 * 使用 Compact Bento Grid 布局 (4列2行)
 */
export const FeaturesSection = React.memo(function FeaturesSection({ className }: FeaturesSectionProps) {
  return (
    <section className={cn("relative z-10 w-full min-h-screen lg:h-screen flex flex-col justify-center py-12 lg:py-0 px-4 lg:px-6 snap-start overflow-hidden", className)}>
      <div className="container mx-auto max-w-7xl h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 lg:mb-10 flex-shrink-0"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            为什么选择 <span className="text-primary">LINUX DO Credit</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            不仅仅是积分流转，更是您社区积分生态的助推器。
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 flex-grow-0">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-3 lg:p-6 border border-white/10 hover:border-primary/50 transition-colors duration-300 flex flex-col justify-between h-full min-h-[140px] lg:min-h-[220px] bg-white/5 backdrop-blur-md hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5",
                feature.className
              )}
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform scale-125 rotate-[-15deg] pointer-events-none">
                <feature.icon className="w-24 h-24" />
              </div>

              <div className="mb-0 lg:mb-4">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-muted/80 flex items-center justify-center mb-2 lg:mb-3 text-primary group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary group-hover:text-primary-foreground backdrop-blur-sm">
                  <feature.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>
                <h3 className="text-sm lg:text-xl font-bold text-foreground mb-1 lg:mb-2 leading-tight">{feature.title}</h3>
                <p className="text-muted-foreground text-[10px] lg:text-sm leading-relaxed line-clamp-3 lg:line-clamp-3">
                  {feature.description}
                </p>
              </div>

              <div className="hidden lg:flex items-center text-xs font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                了解更多 <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
