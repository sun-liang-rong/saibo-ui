# 定时邮件发送服务

基于 NestJS 开发的定时邮件发送系统，支持通过 API 创建定时邮件任务，系统会在指定时间自动发送邮件。

## 功能特性

- ✅ RESTful API 设计，易于集成
- ✅ 支持定时发送邮件（精确到分钟）
- ✅ 邮件内容支持 HTML 格式
- ✅ 自动重试机制（最多 3 次）
- ✅ 邮件发送状态追踪
- ✅ Swagger API 文档
- ✅ 完整的日志系统
- ✅ TypeORM + MySQL 数据持久化
- ✅ 模块化设计，易于扩展

## 技术栈

- **框架**: NestJS 10.x
- **数据库**: MySQL + TypeORM
- **邮件服务**: nodemailer (SMTP)
- **定时任务**: @nestjs/schedule (Cron)
- **验证**: class-validator + class-transformer
- **文档**: Swagger
- **日志**: Winston

## 项目结构

```
email-scheduler/
├── src/
│   ├── common/              # 公共模块
│   │   └── logger/          # 日志服务
│   ├── modules/             # 业务模块
│   │   ├── email/           # 邮件模块
│   │   │   ├── dto/         # 数据传输对象
│   │   │   ├── entities/    # 数据库实体
│   │   │   ├── email.controller.ts
│   │   │   ├── email.service.ts
│   │   │   ├── mail.service.ts
│   │   │   └── email.module.ts
│   │   ├── schedule/        # 定时任务模块
│   │   │   ├── schedule-task.service.ts
│   │   │   └── schedule.module.ts
│   │   └── health/          # 健康检查
│   │       └── health.controller.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
├── .env.example             # 环境变量示例
├── package.json
├── tsconfig.json
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
cd email-scheduler
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 应用配置
NODE_ENV=development
PORT=3000

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=email_scheduler

# 邮件配置 (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=noreply@yourdomain.com
```

### 3. 创建数据库

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE email_scheduler CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 退出
EXIT;
```

### 4. 启动应用

```bash
# 开发模式（热重载）
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

### 5. 访问 Swagger 文档

打开浏览器访问：http://localhost:3000/api-docs

## API 使用示例

### 1. 创建定时邮件任务

**请求：**

```bash
POST http://localhost:3000/emails
Content-Type: application/json

{
  "to_email": "user@example.com",
  "subject": "欢迎使用定时邮件服务",
  "content": "<h1>您好！</h1><p>这是一封测试邮件。</p>",
  "send_time": "2024-12-31T10:30:00Z"
}
```

**响应：**

```json
{
  "id": 1,
  "to_email": "user@example.com",
  "subject": "欢迎使用定时邮件服务",
  "content": "<h1>您好！</h1><p>这是一封测试邮件。</p>",
  "send_time": "2024-12-31T10:30:00.000Z",
  "status": "pending",
  "retry_count": 0,
  "error_message": null,
  "sent_at": null,
  "created_at": "2024-12-30T10:00:00.000Z",
  "updated_at": "2024-12-30T10:00:00.000Z"
}
```

### 2. 查询邮件列表

**请求：**

```bash
GET http://localhost:3000/emails?page=1&limit=10&status=pending
```

**响应：**

```json
{
  "data": [
    {
      "id": 1,
      "to_email": "user@example.com",
      "subject": "欢迎使用定时邮件服务",
      "content": "<h1>您好！</h1><p>这是一封测试邮件。</p>",
      "send_time": "2024-12-31T10:30:00.000Z",
      "status": "pending",
      "retry_count": 0,
      "error_message": null,
      "sent_at": null,
      "created_at": "2024-12-30T10:00:00.000Z",
      "updated_at": "2024-12-30T10:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 3. 查询单个邮件详情

**请求：**

```bash
GET http://localhost:3000/emails/1
```

**响应：**

```json
{
  "id": 1,
  "to_email": "user@example.com",
  "subject": "欢迎使用定时邮件服务",
  "content": "<h1>您好！</h1><p>这是一封测试邮件。</p>",
  "send_time": "2024-12-31T10:30:00.000Z",
  "status": "pending",
  "retry_count": 0,
  "error_message": null,
  "sent_at": null,
  "created_at": "2024-12-30T10:00:00.000Z",
  "updated_at": "2024-12-30T10:00:00.000Z"
}
```

### 4. 删除邮件任务

**请求：**

```bash
DELETE http://localhost:3000/emails/1
```

**响应：** 204 No Content

### 5. 健康检查

**请求：**

```bash
GET http://localhost:3000/health
```

**响应：**

```json
{
  "status": "ok",
  "timestamp": "2024-12-30T10:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### 6. 获取统计信息

**请求：**

```bash
GET http://localhost:3000/health/stats
```

**响应：**

```json
{
  "total": 100,
  "pending": 10,
  "sent": 85,
  "failed": 3,
  "retrying": 2,
  "timestamp": "2024-12-30T10:00:00.000Z"
}
```

## 测试示例

### 使用 curl 测试

```bash
# 1. 创建一个 1 分钟后发送的邮件任务
curl -X POST http://localhost:3000/emails \
  -H "Content-Type: application/json" \
  -d '{
    "to_email": "your_email@example.com",
    "subject": "测试邮件",
    "content": "<h1>测试内容</h1>",
    "send_time": "'$(date -u -d '+1 minute' +%Y-%m-%dT%H:%M:%SZ)'"
  }'

# 2. 查询邮件列表
curl http://localhost:3000/emails

# 3. 查询邮件状态
curl http://localhost:3000/emails/1

# 4. 等待 1 分钟后再次查询，状态应该变为 "sent"
curl http://localhost:3000/emails/1
```

### 使用 Postman 测试

1. 导入 Swagger 文档到 Postman
2. 创建请求并填写参数
3. 发送请求并查看响应

### 使用 JavaScript 测试

```javascript
// 创建邮件任务
const createEmail = async () => {
  const response = await fetch('http://localhost:3000/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to_email: 'user@example.com',
      subject: '测试邮件',
      content: '<h1>测试内容</h1>',
      send_time: new Date(Date.now() + 60000).toISOString(),
    }),
  });

  const data = await response.json();
  console.log('创建成功:', data);
  return data.id;
};

// 查询邮件状态
const checkEmail = async (id) => {
  const response = await fetch(`http://localhost:3000/emails/${id}`);
  const data = await response.json();
  console.log('邮件状态:', data.status);
  return data;
};

// 测试流程
const test = async () => {
  const id = await createEmail();
  console.log('邮件 ID:', id);

  // 每隔 10 秒检查一次状态
  const interval = setInterval(async () => {
    const email = await checkEmail(id);
    if (email.status === 'sent') {
      console.log('邮件发送成功！');
      clearInterval(interval);
    }
  }, 10000);
};

test();
```

## 邮件配置说明

### Gmail 配置

1. 启用两步验证：https://myaccount.google.com/security
2. 生成应用专用密码：https://myaccount.google.com/apppasswords
3. 在 `.env` 中配置：

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

### QQ 邮箱配置

1. 开启 SMTP 服务：设置 -> 账户 -> SMTP 服务
2. 生成授权码
3. 在 `.env` 中配置：

```env
MAIL_HOST=smtp.qq.com
MAIL_PORT=587
MAIL_USER=your_email@qq.com
MAIL_PASSWORD=your_authorization_code
```

### 163 邮箱配置

```env
MAIL_HOST=smtp.163.com
MAIL_PORT=465
MAIL_SECURE=true
MAIL_USER=your_email@163.com
MAIL_PASSWORD=your_authorization_code
```

## 数据库表结构

```sql
CREATE TABLE scheduled_emails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  to_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  send_time DATETIME NOT NULL,
  status ENUM('pending', 'sent', 'failed', 'retrying') DEFAULT 'pending',
  retry_count INT DEFAULT 0,
  error_message TEXT,
  sent_at DATETIME,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_send_time_status (send_time, status),
  INDEX idx_to_email (to_email),
  INDEX idx_status (status)
);
```

## 定时任务说明

系统使用 Cron 表达式每分钟扫描待发送的邮件：

- **执行频率**: 每分钟
- **查询条件**: 状态为 `pending` 或 `retrying`，且发送时间 <= 当前时间
- **重试机制**: 失败后自动重试，最多 3 次
- **日志记录**: 所有操作都会记录到日志文件

## 日志文件

日志文件保存在 `logs/` 目录：

- `combined.log`: 所有日志
- `error.log`: 错误日志

## 生产环境部署

### 使用 PM2 部署

```bash
# 安装 PM2
npm install -g pm2

# 构建项目
npm run build

# 启动应用
pm2 start dist/main.js --name email-scheduler

# 查看日志
pm2 logs email-scheduler

# 停止应用
pm2 stop email-scheduler

# 重启应用
pm2 restart email-scheduler
```

### 使用 Docker 部署

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

构建并运行：

```bash
docker build -t email-scheduler .
docker run -d -p 3000:3000 --env-file .env email-scheduler
```

## 扩展性

### 升级到 BullMQ + Redis

当邮件量达到每分钟几千封以上时，可以升级到 BullMQ：

1. 安装依赖：

```bash
npm install @nestjs/bullmq bullmq ioredis
```

2. 创建队列模块（参考 BullMQ 文档）

3. 替换 Cron 任务为队列处理器

4. 部署 Redis

## 常见问题

### 1. 邮件发送失败

- 检查 SMTP 配置是否正确
- 确认邮箱是否开启了 SMTP 服务
- 检查网络连接
- 查看日志文件：`logs/error.log`

### 2. 定时任务不执行

- 确认 ScheduleTaskModule 已正确导入
- 检查系统时间是否正确
- 查看日志是否有错误信息

### 3. 数据库连接失败

- 检查 MySQL 服务是否启动
- 确认数据库配置是否正确
- 检查数据库用户权限

## License

MIT
