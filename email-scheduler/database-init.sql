-- ====================================================
-- 定时邮件发送服务 - 数据库初始化脚本
-- ====================================================

-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS email_scheduler
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE email_scheduler;

-- 2. 创建邮件任务表
CREATE TABLE IF NOT EXISTS scheduled_emails (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
  to_email VARCHAR(255) NOT NULL COMMENT '收件人邮箱',
  subject VARCHAR(500) NOT NULL COMMENT '邮件标题',
  content TEXT NOT NULL COMMENT '邮件内容（HTML）',
  send_time DATETIME NOT NULL COMMENT '定时发送时间',
  status ENUM('pending', 'sent', 'failed', 'retrying') DEFAULT 'pending' COMMENT '发送状态',
  retry_count INT DEFAULT 0 COMMENT '重试次数',
  error_message TEXT COMMENT '错误信息',
  sent_at DATETIME DEFAULT NULL COMMENT '实际发送时间',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  -- 索引
  INDEX idx_send_time_status (send_time, status) COMMENT '定时任务查询索引',
  INDEX idx_to_email (to_email) COMMENT '邮箱查询索引',
  INDEX idx_status (status) COMMENT '状态查询索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='定时邮件任务表';

-- 3. 插入测试数据（可选）
-- 注意：测试数据中的邮箱需要替换为真实邮箱才能发送

INSERT INTO scheduled_emails (
  to_email,
  subject,
  content,
  send_time,
  status
) VALUES
(
  'test@example.com',
  '测试邮件 - 系统初始化',
  '<h2>欢迎使用定时邮件发送服务</h2><p>这是系统初始化时插入的测试数据。</p>',
  DATE_ADD(NOW(), INTERVAL 1 MINUTE),
  'pending'
);

-- 4. 查看表结构
DESCRIBE scheduled_emails;

-- 5. 查询测试数据
SELECT
  id,
  to_email,
  subject,
  send_time,
  status,
  created_at
FROM scheduled_emails;

-- ====================================================
-- 常用查询语句
-- ====================================================

-- 查询所有待发送的邮件
-- SELECT * FROM scheduled_emails WHERE status = 'pending';

-- 查询已发送的邮件
-- SELECT * FROM scheduled_emails WHERE status = 'sent';

-- 查询发送失败的邮件
-- SELECT * FROM scheduled_emails WHERE status = 'failed';

-- 查询今天的邮件统计
-- SELECT
--   status,
--   COUNT(*) as count
-- FROM scheduled_emails
-- WHERE DATE(created_at) = CURDATE()
-- GROUP BY status;

-- 清空所有邮件（慎用）
-- TRUNCATE TABLE scheduled_emails;

-- 删除测试数据
-- DELETE FROM scheduled_emails WHERE to_email = 'test@example.com';
