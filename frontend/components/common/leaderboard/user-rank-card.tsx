"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { UserRankResponse } from "@/lib/services/leaderboard";

interface UserRankCardProps {
  data: UserRankResponse | null;
  loading?: boolean;
  className?: string;
}

export const UserRankCard = React.memo(function UserRankCard({
  data,
  loading,
  className,
}: UserRankCardProps) {
  if (loading) {
    return (
      <div className={cn("bg-blue-100 rounded-xl p-4", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24 bg-blue-200" />
          <Skeleton className="h-5 w-8 bg-blue-200" />
          <Skeleton className="h-6 w-16 bg-blue-200" />
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const balance: number = parseFloat(data.user.available_balance);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("bg-blue-100 dark:bg-blue-900/20 rounded-xl px-5 py-4 ", className)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-bold text-lg tabular-nums">
            # {data.user.rank.toLocaleString()}
          </span>
        </div>

        <span className="text-blue-600 font-bold text-lg">您</span>

        <span className="text-blue-600 font-bold text-lg tabular-nums">
          {balance.toFixed(2)}
        </span>
      </div>
    </motion.div>
  );
});
