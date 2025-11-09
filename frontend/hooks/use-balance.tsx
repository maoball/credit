"use client"

import { useCallback, useEffect, useState } from 'react';
import services from '@/lib/services';
import type { Balance, TransactionQueryParams, Transaction, PaginationResponse } from '@/lib/services';

/**
 * 余额数据 Hook 的返回值
 */
interface UseBalanceReturn {
  /** 余额数据 */
  balance: Balance | null;
  /** 是否加载中 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 重新获取数据 */
  refetch: () => Promise<void>;
}

/**
 * 使用余额数据
 * @returns 余额数据、加载状态、错误和重新获取方法
 * 
 * @example
 * ```tsx
 * function BalanceComponent() {
 *   const { balance, loading, error, refetch } = useBalance();
 *   
 *   if (loading) return <div>加载中...</div>;
 *   if (error) return <div>错误: {error.message}</div>;
 *   if (!balance) return null;
 *   
 *   return <div>总余额: {balance.total}</div>;
 * }
 * ```
 */
export function useBalance(): UseBalanceReturn {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await services.balance.getBalance();
      setBalance(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('获取余额数据失败'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return {
    balance,
    loading,
    error,
    refetch: fetchBalance,
  };
}

/**
 * 交易记录查询 Hook 的参数
 */
interface UseTransactionsOptions extends TransactionQueryParams {
  /** 是否自动获取 */
  enabled?: boolean;
}

/**
 * 交易记录查询 Hook 的返回值
 */
interface UseTransactionsReturn {
  /** 分页数据 */
  data: PaginationResponse<Transaction> | null;
  /** 是否加载中 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 重新获取数据 */
  refetch: () => Promise<void>;
  /** 加载下一页 */
  loadMore: () => Promise<void>;
  /** 是否正在加载更多 */
  loadingMore: boolean;
}

/**
 * 使用交易记录查询（支持分页）
 * @param options - 查询选项
 * @returns 分页数据、加载状态、错误和相关操作方法
 * 
 * @example
 * ```tsx
 * function TransactionList() {
 *   const { data, loading, error, loadMore, loadingMore } = useTransactions({
 *     type: 'receive',
 *     page_size: 20
 *   });
 *   
 *   if (loading) return <div>加载中...</div>;
 *   if (error) return <div>错误: {error.message}</div>;
 *   if (!data) return null;
 *   
 *   return (
 *     <div>
 *       {data.items.map(t => (
 *         <div key={t.orderNo}>{t.orderName}</div>
 *       ))}
 *       {data.page < data.total_pages && (
 *         <button onClick={loadMore} disabled={loadingMore}>
 *           {loadingMore ? '加载中...' : '加载更多'}
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTransactions(
  options: UseTransactionsOptions = {}
): UseTransactionsReturn {
  const { enabled = true, ...params } = options;
  const [data, setData] = useState<PaginationResponse<Transaction> | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // 用于标记是否是首次加载
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchTransactions = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        // 只在首次加载或手动刷新时显示 loading
        if (isInitialLoad) {
          setLoading(true);
        }
      }
      setError(null);

      const result = await services.balance.getTransactions({
        ...params,
        page,
      });

      if (append && data) {
        // 追加数据
        setData({
          ...result,
          items: [...data.items, ...result.items],
        });
      } else {
        // 替换数据
        setData(result);
      }

      setCurrentPage(page);
      setIsInitialLoad(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('获取交易记录失败'));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [params, data, isInitialLoad]);

  const loadMore = async () => {
    if (data && currentPage < data.total_pages && !loadingMore) {
      await fetchTransactions(currentPage + 1, true);
    }
  };

  useEffect(() => {
    if (enabled) {
      setCurrentPage(1);
      fetchTransactions(1, false);
    }
  }, [enabled, params.type, params.status, params.startTime, params.endTime, params.page_size, fetchTransactions]);

  return {
    data,
    loading,
    error,
    refetch: () => {
      setIsInitialLoad(true);
      return fetchTransactions(1, false);
    },
    loadMore,
    loadingMore,
  };
}

