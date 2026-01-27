/**
 * 邮件模板管理模块
 *
 * 提供多种预设的邮件模板，方便快速创建邮件任务
 */

import { birthday } from './birthday';
import { flower } from './flower';
import { festival } from './festival';
import { greeting } from './greeting';
import { thankYou } from './thankYou';
import { reminder } from './reminder';
import { invitation } from './invitation';
import { newsletter } from './newsletter';

/**
 * 模板类型定义
 */
export interface EmailTemplate {
  id: string;           // 模板唯一标识
  name: string;         // 模板名称
  category: string;     // 模板分类
  description: string;  // 模板描述
  subject: string;      // 默认标题
  content: string;      // 邮件内容（支持HTML）
  thumbnail?: string;   // 预览图（可选）
}

/**
 * 所有可用模板列表
 */
export const TEMPLATES: EmailTemplate[] = [
  birthday,
  flower,
  festival,
  greeting,
  thankYou,
  reminder,
  invitation,
  newsletter,
];

/**
 * 根据分类获取模板
 */
export const getTemplatesByCategory = (category: string): EmailTemplate[] => {
  return TEMPLATES.filter(template => template.category === category);
};

/**
 * 根据ID获取模板
 */
export const getTemplateById = (id: string): EmailTemplate | undefined => {
  return TEMPLATES.find(template => template.id === id);
};

/**
 * 获取所有分类
 */
export const getCategories = (): string[] => {
  return Array.from(new Set(TEMPLATES.map(template => template.category)));
};

// 导出所有模板
export { birthday, flower, festival, greeting, thankYou, reminder, invitation, newsletter };
