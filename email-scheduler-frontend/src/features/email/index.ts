/**
 * Email Feature Module
 *
 * 邮件管理功能模块
 */

// 导出所有email相关组件
export { default as EmailTaskList } from '../../components/EmailTaskList';
export { default as EmailTaskForm } from '../../components/EmailTaskForm';
export { default as EmailDetailModal } from '../../components/EmailDetailModal';

// 导出API
export { default as emailApi } from '../../services/emailService';

// 导出模板
export * from '../../template';

// 导出类型
export type { EmailTask, EmailStats } from '../../types';
