# 登录功能使用文档

## 功能概述

系统已完成用户登录和注册功能，支持基于 JWT 的身份验证。

## 功能特性

- ✅ 用户登录（用户名 + 密码）
- ✅ 用户注册（用户名 + 密码 + 邮箱）
- ✅ JWT Token 生成和验证
- ✅ 密码 bcrypt 加密存储
- ✅ 用户状态管理（激活/禁用）
- ✅ Swagger API 文档

## 数据库表结构

### users 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| username | VARCHAR(100) | 用户名（唯一） |
| password | VARCHAR(255) | 密码（bcrypt 加密） |
| email | VARCHAR(255) | 邮箱地址（可选） |
| is_active | TINYINT(1) | 是否激活（默认 1） |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

## 安装和配置

### 1. 安装依赖

```bash
cd email-scheduler
npm install
```

新增依赖包括：
- @nestjs/jwt - JWT token 生成
- @nestjs/passport - Passport 认证
- passport-jwt - JWT 策略
- bcrypt - 密码加密

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，添加 JWT 配置：

```env
# JWT 配置
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h
```

**⚠️ 重要提示：**
- 生产环境中务必使用强密钥
- 不要在代码中硬编码密钥
- 建议使用至少 32 位的随机字符串

### 3. 初始化数据库

运行数据库初始化脚本：

```bash
mysql -u root -p < database-users-init.sql
```

该脚本会：
1. 创建 `users` 表
2. 插入默认管理员账号
3. 插入测试账号

### 4. 启动应用

```bash
npm run start:dev
```

## API 接口

### 1. 用户登录

**接口：** `POST /auth/login`

**请求体：**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**成功响应（200）：**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

**失败响应（401）：**

```json
{
  "statusCode": 401,
  "message": "用户名或密码错误",
  "error": "Unauthorized"
}
```

### 2. 用户注册

**接口：** `POST /auth/register`

**请求体：**

```json
{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com"
}
```

**成功响应（201）：**

```json
{
  "id": 2,
  "username": "newuser",
  "email": "user@example.com"
}
```

**失败响应（400）：**

```json
{
  "statusCode": 401,
  "message": "用户名已存在",
  "error": "Unauthorized"
}
```

## 默认账号

系统初始化后会创建以下默认账号：

### 管理员账号

- **用户名：** admin
- **密码：** admin123
- **邮箱：** admin@example.com

### 测试账号

- **用户名：** testuser
- **密码：** test123
- **邮箱：** test@example.com

**⚠️ 安全提示：**
- 生产环境中请务必修改默认密码
- 建议删除或禁用测试账号

## 使用 JWT Token

### 在请求头中使用 Token

登录成功后，后续需要认证的接口都需要在请求头中携带 JWT token：

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 示例：使用 curl

```bash
# 1. 登录获取 token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 2. 使用 token 访问受保护的接口
curl -X GET http://localhost:3000/emails \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 示例：使用 JavaScript (Fetch)

```javascript
// 1. 登录
async function login(username, password) {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  return data.access_token;
}

// 2. 使用 token 访问受保护的接口
async function getEmails(token) {
  const response = await fetch('http://localhost:3000/emails', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return await response.json();
}

// 使用示例
login('admin', 'admin123')
  .then(token => getEmails(token))
  .then(data => console.log(data));
```

## 测试示例

### 使用 Swagger 测试

1. 启动应用后访问：http://localhost:3000/api-docs
2. 找到 `auth` 分组
3. 展开 `POST /auth/login`
4. 点击 "Try it out"
5. 输入用户名和密码
6. 点击 "Execute"
7. 查看响应结果

### 使用 Postman 测试

1. 创建新请求
2. 方法选择 `POST`
3. URL 输入：`http://localhost:3000/auth/login`
4. Headers 添加：`Content-Type: application/json`
5. Body 选择 `raw`，输入：
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
6. 发送请求

### 使用 Node.js 脚本测试

```javascript
const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      username: 'admin',
      password: 'admin123',
    });

    console.log('登录成功！');
    console.log('Token:', response.data.access_token);
    console.log('用户信息:', response.data.user);

    // 使用 token 访问受保护的接口
    const emailsResponse = await axios.get('http://localhost:3000/emails', {
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`,
      },
    });

    console.log('邮件列表:', emailsResponse.data);
  } catch (error) {
    console.error('登录失败:', error.response?.data || error.message);
  }
}

testLogin();
```

## 保护路由

如果需要保护某些路由（需要登录才能访问），使用 `@UseGuards(JwtAuthGuard)` 装饰器：

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('emails')
export class EmailController {
  @Get()
  @UseGuards(JwtAuthGuard) // 保护此路由
  findAll() {
    // ...
  }
}
```

## 密码管理

### 生成加密密码

如果需要手动添加用户，可以使用以下 Node.js 脚本生成加密密码：

```javascript
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log('明文密码:', password);
  console.log('加密密码:', hash);
  return hash;
}

hashPassword('your-new-password');
```

### 修改默认密码

登录系统后，建议立即修改默认密码：

```sql
-- 生成新的加密密码后，更新数据库
UPDATE users
SET password = '$2b$10$新的加密密码'
WHERE username = 'admin';
```

## 常见问题

### 1. 登录失败，提示 "用户名或密码错误"

**可能原因：**
- 用户名或密码输入错误
- 用户不存在
- 用户已被禁用

**解决方法：**
- 检查用户名和密码是否正确
- 确认用户已创建：`SELECT * FROM users WHERE username = 'admin';`
- 检查用户状态：`UPDATE users SET is_active = 1 WHERE username = 'admin';`

### 2. Token 验证失败

**可能原因：**
- Token 过期
- Token 格式错误
- JWT_SECRET 不一致

**解决方法：**
- 重新登录获取新 token
- 确认请求头格式：`Authorization: Bearer <token>`
- 检查 JWT_SECRET 配置

### 3. 密码加密失败

**可能原因：**
- bcrypt 依赖未安装
- Node.js 版本不兼容

**解决方法：**
```bash
# 重新安装依赖
npm install

# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

## 安全建议

1. **使用强密码**
   - 至少 8 位
   - 包含大小写字母、数字和特殊字符
   - 定期更换

2. **保护 JWT_SECRET**
   - 不要在代码中硬编码
   - 使用环境变量
   - 定期更换

3. **启用 HTTPS**
   - 生产环境必须使用 HTTPS
   - 防止 token 被窃取

4. **设置 Token 过期时间**
   - 不要设置过长
   - 建议 1 小时
   - 实现 token 刷新机制

5. **限制登录尝试次数**
   - 防止暴力破解
   - 实现验证码
   - 账户锁定机制

## 下一步扩展

- [ ] 实现 Token 刷新机制
- [ ] 添加忘记密码功能
- [ ] 实现邮箱验证
- [ ] 添加双因素认证（2FA）
- [ ] 实现权限管理（角色、权限）
- [ ] 添加登录日志
- [ ] 实现 IP 白名单
- [ ] 添加验证码功能
