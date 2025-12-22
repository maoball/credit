/**
 * 配置服务模块
 * 
 * @description
 * 提供系统公共配置相关的功能，包括：
 * - 获取公共配置（争议时间窗口等）
 * 
 * @example
 * ```typescript
 * import { ConfigService } from '@/lib/services';
 * 
 * // 获取公共配置
 * const config = await ConfigService.getPublicConfig();
 * console.log('争议时间窗口:', config.dispute_time_window_hours, '小时');
 * ```
 */

export { ConfigService } from './config.service';
export type * from './types';
