-- Active: 1768880028311@@mysql5.sqlpub.com@3310@nest_test
-- =====================================================
-- 邮件调度系统重构 - 数据库迁移脚本
-- 日期: 2025-01-28
-- 目的: 添加规则和实例区分,支持新频率(每小时/纪念日)
-- =====================================================

-- 步骤1: 备份原表
CREATE TABLE IF NOT EXISTS scheduled_emails_backup AS SELECT * FROM scheduled_emails;

-- 步骤2: 添加新字段
ALTER TABLE scheduled_emails
ADD COLUMN IF NOT EXISTS is_rule BOOLEAN DEFAULT TRUE COMMENT '是否为规则记录: true=规则,false=实例',
ADD COLUMN IF NOT EXISTS last_sent_at DATETIME DEFAULT NULL COMMENT '最后发送时间 (仅规则使用,防重复发送)',
ADD COLUMN IF NOT EXISTS next_send_at DATETIME DEFAULT NULL COMMENT '下次预计发送时间 (仅规则使用,优化查询)',
ADD COLUMN IF NOT EXISTS anniversary_month INT DEFAULT NULL COMMENT '纪念日月份 (1-12, 仅anniversary频率使用)',
ADD COLUMN IF NOT EXISTS anniversary_day INT DEFAULT NULL COMMENT '纪念日日期 (1-31, 仅anniversary频率使用)';

-- 步骤3: 添加索引
CREATE INDEX idx_is_rule ON scheduled_emails(is_rule);
CREATE INDEX idx_parent_id_is_rule ON scheduled_emails(parent_id, is_rule);
CREATE INDEX idx_last_sent_at ON scheduled_emails(last_sent_at);
CREATE INDEX idx_next_send_at ON scheduled_emails(next_send_at);

-- 步骤4: 更新 frequency 枚举 (需要修改表结构)
-- MySQL 不直接支持修改 ENUM,需要重建
ALTER TABLE scheduled_emails
MODIFY COLUMN frequency ENUM('once', 'hourly', 'daily', 'weekly', 'anniversary') DEFAULT 'once' COMMENT '调度频率: once=单次, hourly=每小时, daily=每天, weekly=每周, anniversary=纪念日';

-- 步骤5: 数据迁移 - 标记规则和实例
-- 5.1 将父任务标记为规则
UPDATE scheduled_emails
SET is_rule = TRUE
WHERE parent_id IS NULL;

-- 5.2 将子任务标记为实例
UPDATE scheduled_emails
SET is_rule = FALSE
WHERE parent_id IS NOT NULL;

-- 步骤6: 更新规则的 last_sent_at (从实例聚合)
UPDATE scheduled_emails r
SET r.last_sent_at = (
    SELECT MAX(i.sent_at)
    FROM scheduled_emails i
    WHERE i.parent_id = r.id
      AND i.sent_at IS NOT NULL
)
WHERE r.is_rule = TRUE
  AND EXISTS (
    SELECT 1
    FROM scheduled_emails i
    WHERE i.parent_id = r.id
      AND i.sent_at IS NOT NULL
  );

-- 步骤7: 将已发送的单次任务标记为完成
UPDATE scheduled_emails
SET status = 'sent'
WHERE is_rule = TRUE
  AND frequency = 'once'
  AND last_sent_at IS NOT NULL;

-- 步骤8: 验证数据
SELECT '=== 数据迁移验证 ===' AS '';
SELECT
    '规则总数' AS type,
    COUNT(*) AS count
FROM scheduled_emails
WHERE is_rule = TRUE
UNION ALL
SELECT
    '实例总数' AS type,
    COUNT(*) AS count
FROM scheduled_emails
WHERE is_rule = FALSE
UNION ALL
SELECT
    '待发送规则' AS type,
    COUNT(*) AS count
FROM scheduled_emails
WHERE is_rule = TRUE AND status = 'pending'
UNION ALL
SELECT
    '已完成单次规则' AS type,
    COUNT(*) AS count
FROM scheduled_emails
WHERE is_rule = TRUE AND frequency = 'once' AND status = 'sent';

-- 步骤9: 显示迁移结果
SELECT '=== 迁移完成 ===' AS '';
SELECT
    id,
    is_rule,
    parent_id,
    frequency,
    status,
    send_time,
    last_sent_at,
    sent_at
FROM scheduled_emails
ORDER BY is_rule DESC, id DESC
LIMIT 20;

-- =====================================================
-- 回滚方案 (如需回滚,执行以下SQL)
-- =====================================================
/*
-- 删除新增字段
ALTER TABLE scheduled_emails
DROP COLUMN is_rule,
DROP COLUMN last_sent_at,
DROP COLUMN next_send_at,
DROP COLUMN anniversary_month,
DROP COLUMN anniversary_day;

-- 恢复 frequency 枚举
ALTER TABLE scheduled_emails
MODIFY COLUMN frequency ENUM('once', 'daily', 'weekly') DEFAULT 'once';

-- 从备份恢复
DROP TABLE scheduled_emails;
CREATE TABLE scheduled_emails AS SELECT * FROM scheduled_emails_backup;
*/
