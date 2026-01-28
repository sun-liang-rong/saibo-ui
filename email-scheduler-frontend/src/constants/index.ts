/**
 * 全局常量定义
 */

/**
 * API基础URL
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Token存储key
 */
export const TOKEN_KEY = 'auth_token';

/**
 * 用户信息存储key
 */
export const USER_INFO_KEY = 'user_info';

/**
 * 分页默认配置
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
} as const;

/**
 * 邮件频率映射
 */
export const FREQUENCY_MAP = {
  once: '单次',
  hourly: '每小时',
  daily: '每天',
  weekly: '每周',
  anniversary: '纪念日',
} as const;

/**
 * 邮件状态映射
 */
export const STATUS_MAP = {
  pending: '待发送',
  sent: '已发送',
  failed: '发送失败',
  retrying: '重试中',
} as const;

/**
 * 颜色映射
 */
export const STATUS_COLOR = {
  pending: 'orange',
  sent: 'green',
  failed: 'red',
  retrying: 'blue',
} as const;
