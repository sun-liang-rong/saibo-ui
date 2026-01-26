-- Active: 1768880028311@@mysql5.sqlpub.com@3310@nest_test
-- ====================================================
-- 定时邮件发送系统 - 用户表初始化脚本
-- ====================================================

USE email_scheduler;

-- 1. 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
  username VARCHAR(100) NOT NULL UNIQUE COMMENT '用户名（唯一）',
  password VARCHAR(255) NOT NULL COMMENT '密码（bcrypt 加密）',
  email VARCHAR(255) DEFAULT NULL COMMENT '邮箱地址',
  is_active TINYINT(1) DEFAULT 1 COMMENT '是否激活（1=是，0=否）',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  -- 索引
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2. 插入默认用户
-- 默认用户名: admin
-- 默认密码: admin123
-- 密码使用 bcrypt 加密（salt rounds: 10）
-- 注意：在生产环境中，请务必修改默认密码！

INSERT INTO users (username, password, email, is_active) VALUES
(
  'admin',
  '$2b$10$Ze6WujPo6sKldbB8NwdZbu4axJ5nA2kv8ugOl1Q4TkNtoCa26W4ty',
  'admin@example.com',
  1
);

-- 3. 插入测试用户（可选）
-- 用户名: testuser
-- 密码: test123
INSERT INTO users (username, password, email, is_active) VALUES
(
  'testuser',
  '$2b$10$Ze6WujPo6sKldbB8NwdZbu4axJ5nA2kv8ugOl1Q4TkNtoCa26W4ty',
  'test@example.com',
  1
)
ON DUPLICATE KEY UPDATE username = username;

-- 4. 查看表结构
DESCRIBE users;

-- 5. 查询所有用户
SELECT
  id,
  username,
  email,
  is_active,
  created_at
FROM users;

-- ====================================================
-- 使用说明
-- ====================================================

/*
默认登录账号：

1. 管理员账号：
   - 用户名: admin
   - 密码: admin123

2. 测试账号：
   - 用户名: testuser
   - 密码: test123

⚠️ 安全提示：
在生产环境中，请务必：
1. 修改默认密码
2. 删除或禁用测试账号
3. 使用强密码
4. 启用 HTTPS
5. 定期更换密码

生成新的 bcrypt 密码（Node.js）：
const bcrypt = require('bcrypt');
const password = 'your-new-password';
const hash = await bcrypt.hash(password, 10);
console.log(hash);
*/

-- ====================================================
-- 常用查询语句
-- ====================================================

-- 查询所有激活的用户
-- SELECT * FROM users WHERE is_active = 1;

-- 查询指定用户
-- SELECT * FROM users WHERE username = 'admin';

-- 创建新用户（需要使用 bcrypt 加密密码）
-- INSERT INTO users (username, password, email, is_active) VALUES
-- ('newuser', '$2b$10$...', 'user@example.com', 1);

-- 禁用用户
-- UPDATE users SET is_active = 0 WHERE username = 'testuser';

-- 启用用户
-- UPDATE users SET is_active = 1 WHERE username = 'testuser';

-- 删除用户（慎用）
-- DELETE FROM users WHERE username = 'testuser';
