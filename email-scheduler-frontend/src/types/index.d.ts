/**
 * 全局类型定义
 */

/**
 * API响应基础类型
 */
export interface ApiResponse<T = any> {
  code?: number;
  message?: string;
  data: T;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 邮件状态
 */
export type EmailStatus = 'pending' | 'sent' | 'failed' | 'retrying';

/**
 * 调度频率
 */
export type ScheduleFrequency = 'once' | 'hourly' | 'daily' | 'weekly' | 'anniversary';

/**
 * 邮件任务
 */
export interface EmailTask {
  id: number;
  to_email: string;
  subject: string;
  content: string;
  send_time: string;
  status: EmailStatus;
  frequency: ScheduleFrequency;
  week_day?: number;
  anniversary_month?: number;
  anniversary_day?: number;
  include_weather: boolean;
  weather_city?: string;
  template_category?: string;
  template_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * 邮件统计
 */
export interface EmailStats {
  total: number;
  pending: number;
  sent: number;
  failed: number;
  retrying: number;
}

/**
 * 用户信息
 */
export interface UserInfo {
  id: number;
  username: string;
  email?: string;
}
