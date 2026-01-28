-- Active: 1768880028311@@mysql5.sqlpub.com@3310@nest_test
-- =====================================================
-- 邮件调度系统 - 添加模板字段迁移脚本
-- 日期: 2025-01-28
-- 目的: 在 scheduled_emails 表添加模板相关字段
-- =====================================================

-- 步骤1: 添加新字段
ALTER TABLE scheduled_emails
ADD COLUMN IF NOT EXISTS template_category VARCHAR(50) DEFAULT NULL COMMENT '模板分类 (如: greeting, birthday, reminder 等)',
ADD COLUMN IF NOT EXISTS template_id INT DEFAULT NULL COMMENT '模板ID (用于标识使用了哪个模板)';

-- 步骤2: 添加索引
CREATE INDEX idx_template_category ON scheduled_emails(template_category);
CREATE INDEX idx_template_id ON scheduled_emails(template_id);

-- 步骤3: 验证字段添加
SELECT '=== 模板字段添加验证 ===' AS '';
DESCRIBE scheduled_emails;

-- 步骤4: 显示迁移结果
SELECT '=== 迁移完成 ===' AS '';
SELECT
    COLUMN_NAME AS '字段名',
    COLUMN_TYPE AS '类型',
    IS_NULLABLE AS '可空',
    COLUMN_DEFAULT AS '默认值',
    COLUMN_COMMENT AS '注释'
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'scheduled_emails'
  AND COLUMN_NAME IN ('template_category', 'template_id');

-- =====================================================
-- 回滚方案 (如需回滚,执行以下SQL)
-- =====================================================
/*
-- 删除新增字段
ALTER TABLE scheduled_emails
DROP COLUMN template_category,
DROP COLUMN template_id;
*/
