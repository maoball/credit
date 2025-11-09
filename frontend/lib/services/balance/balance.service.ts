import { BaseService } from '../core/base.service';
import type { PaginationResponse } from '../core/types';
import type { Transaction, TransactionQueryParams, Balance } from './types';
import mockBalance from '@/test/mock_balance.json';

/**
 * 余额服务
 * 处理余额和交易记录相关的 API 请求
 */
export class BalanceService extends BaseService {
  protected static readonly basePath = '/api/v1/balance';

  /**
   * 获取余额信息
   * @returns 余额信息
   * @throws {UnauthorizedError} 当未登录时
   * @throws {NetworkError} 当网络连接失败时
   */
  static async getBalance(): Promise<Balance> {
    // TODO: 后续替换为真实 API 调用
    // return this.get<Balance>('/');
    
    // 暂时返回 mock 数据（本地数据无需延迟）
    return Promise.resolve(mockBalance.balance as Balance);
  }

  /**
   * 获取交易记录列表（分页）
   * @param params - 查询参数
   * @returns 分页的交易记录列表
   * @throws {UnauthorizedError} 当未登录时
   * @throws {ValidationError} 当参数验证失败时
   */
  static async getTransactions(params?: TransactionQueryParams): Promise<PaginationResponse<Transaction>> {
    // TODO: 后续替换为真实 API 调用
    // return this.get<PaginationResponse<Transaction>>('/transactions', params);
    
    // 暂时返回 mock 数据（本地数据无需延迟）
    const page = params?.page || 1;
    const page_size = params?.page_size || 20;
    
    // 合并所有交易类型
    let allTransactions: Transaction[] = [];
    
    if (params?.type) {
      // 如果指定了类型，只返回该类型
      const typeKey = params.type as keyof typeof mockBalance;
      if (typeKey in mockBalance && Array.isArray(mockBalance[typeKey])) {
        allTransactions = [...(mockBalance[typeKey] as Transaction[])];
      }
    } else {
      // 所有活动 = receive + transfer + community
      allTransactions = [
        ...(mockBalance.receive as Transaction[]),
        ...(mockBalance.transfer as Transaction[]),
        ...(mockBalance.community as Transaction[]),
      ];
    }
    
    // 根据状态过滤
    if (params?.status) {
      allTransactions = allTransactions.filter(t => t.status === params.status);
    }
    
    // 按时间排序（最新的在前）
    allTransactions.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    
    // 分页处理
    const total = allTransactions.length;
    const total_pages = Math.ceil(total / page_size);
    const startIndex = (page - 1) * page_size;
    const endIndex = startIndex + page_size;
    const items = allTransactions.slice(startIndex, endIndex);
    
    return Promise.resolve({
      items,
      page,
      page_size,
      total,
      total_pages,
    });
  }

  /**
   * 获取指定交易详情
   * @param orderNo - 订单号
   * @returns 交易详情
   * @throws {NotFoundError} 当交易不存在时
   * @throws {UnauthorizedError} 当未登录时
   */
  static async getTransactionDetail(orderNo: string): Promise<Transaction> {
    // TODO: 后续替换为真实 API 调用
    // return this.get<Transaction>(`/transactions/${orderNo}`);
    
    // 暂时从 mock 数据中查找（本地数据无需延迟）
    const allTransactions = [
      ...(mockBalance.receive as Transaction[]),
      ...(mockBalance.transfer as Transaction[]),
      ...(mockBalance.community as Transaction[]),
    ];
    
    const transaction = allTransactions.find(t => t.orderNo === orderNo);
    
    if (transaction) {
      return Promise.resolve(transaction);
    } else {
      return Promise.reject(new Error('交易记录不存在'));
    }
  }
}

