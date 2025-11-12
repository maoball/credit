/**
 * 服务层统一入口
 * 提供所有业务服务的访问接口
 * 
 * @example
 * ```typescript
 * // 推荐：使用统一的 services 对象
 * import services from '@/lib/services';
 * 
 * const user = await services.auth.getUserInfo();
 * const transactions = await services.transaction.getTransactions({ page: 1, page_size: 20 });
 * ```
 * 
 * @example
 * ```typescript
 * // 按需导入：直接导入特定服务
 * import { AuthService } from '@/lib/services';
 * 
 * const user = await AuthService.getUserInfo();
 * ```
 */

import { AuthService } from './auth';
import { TransactionService } from './transaction';
import { MerchantService } from './merchant';

/**
 * 服务对象
 * 集中导出所有业务服务
 * 
 * @description
 * 推荐使用此对象访问所有服务，保持代码风格统一
 */
const services = {
  /** 认证服务 */
  auth: AuthService,
  /** 交易服务 */
  transaction: TransactionService,
  /** 商户服务 */
  merchant: MerchantService,
} as const;

export default services;

// ==================== 核心模块导出 ====================

export {
  apiClient,
  BaseService,
  apiConfig,
  cancelRequest,
  cancelAllRequests,
} from './core';

export {
  ApiErrorBase,
  NetworkError,
  TimeoutError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  ValidationError,
  isCancelError,
} from './core';

export type {
  ApiResponse,
  ApiError,
  PaginationParams,
  PaginationResponse,
  RequestConfig,
} from './core';

// ==================== 业务服务导出 ====================

// 认证服务
export { AuthService, TrustLevel } from './auth';
export type {
  User,
  OAuthLoginUrlResponse,
  OAuthCallbackRequest,
} from './auth';

// 交易服务
export { TransactionService } from './transaction';
export type {
  Order,
  OrderType,
  OrderStatus,
  TransactionQueryParams,
  TransactionListResponse,
} from './transaction';

// 商户服务
export { MerchantService } from './merchant';
export type {
  MerchantAPIKey,
  CreateAPIKeyRequest,
  UpdateAPIKeyRequest,
  CreateMerchantOrderRequest,
  CreateMerchantOrderResponse,
  PayMerchantOrderRequest,
} from './merchant';
