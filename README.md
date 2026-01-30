# 邮件定时调度系统

## 项目简介

邮件定时调度系统是一个基于前后端分离架构的自动化邮件发送平台，支持创建邮件模板、配置定时任务、监控执行历史等功能。

### 核心功能

- **邮件模板管理**：支持多种模板类型（新闻、天气、黄金等），使用 Handlebars 模板引擎动态渲染
- **定时任务调度**：基于 Cron 表达式的灵活定时配置，支持单次执行和周期性执行
- **任务监控**：实时查看任务状态、执行历史和错误日志
- **用户认证**：JWT 身份验证，确保系统安全
- **分页查询**：所有列表接口支持分页，提升大数据量下的性能

## 技术架构

### 后端技术栈

- **框架**：NestJS 10.x
- **ORM**：TypeORM 0.3.x
- **数据库**：MySQL 8.x
- **认证**：JWT + Passport
- **定时任务**：@nestjs/schedule + cron
- **邮件服务**：Nodemailer
- **API 文档**：Swagger
- **日志**：Winston
- **模板引擎**：Handlebars

### 前端技术栈

- **框架**：React 19.x
- **构建工具**：Vite 7.x
- **UI 组件库**：Ant Design 6.x
- **路由**：React Router DOM 7.x
- **HTTP 客户端**：Axios
- **日期处理**：Day.js
- **语言**：TypeScript

## 项目结构

```
zujian/
├── email-scheduler/          # 后端服务
│   ├── src/
│   │   ├── modules/          # 业务模块
│   │   │   ├── auth/         # 认证模块
│   │   │   ├── email-templates/  # 邮件模板模块
│   │   │   ├── mail/         # 邮件发送模块
│   │   │   └── tasks/        # 定时任务模块
│   │   └── common/           # 公共模块
│   ├── ecosystem.config.js   # PM2 部署配置
│   └── package.json
│
└── frontend/                 # 前端应用
    ├── src/
    │   ├── components/       # 公共组件
    │   ├── pages/           # 页面组件
    │   └── utils/           # 工具函数
    └── package.json
```

## 快速开始

### 环境要求

- Node.js >= 18.x
- MySQL >= 8.x
- npm 或 yarn

### 数据库配置

1. 创建 MySQL 数据库

2. 配置数据库连接（修改 `email-scheduler/src/modules/app.module.ts`）：

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'your_password',
  database: 'email_scheduler',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
}),
```

### 后端启动

```bash
# 进入后端目录
cd email-scheduler

# 安装依赖
npm install

# 启动开发服务器
npm run start:dev

# 编译
npm run build

# 生产环境启动
npm run start:prod
```

后端服务默认运行在 `http://localhost:3000`

API 文档地址：`http://localhost:3000/api`

### 前端启动

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 编译生产版本
npm run build

# 预览生产版本
npm run preview
```

前端服务默认运行在 `http://localhost:5173`

## 部署指南

### 生产环境配置

1. 修改 `email-scheduler/ecosystem.config.js` 配置生产环境变量

2. 构建后端

```bash
cd email-scheduler
npm run build
```

3. 构建前端

```bash
cd frontend
npm run build
```

4. 使用 PM2 部署后端

```bash
# 全局安装 PM2
npm install -g pm2

# 启动服务
pm2 start ecosystem.config.js

# 查看日志
pm2 logs nest-app

# 停止服务
pm2 stop nest-app

# 重启服务
pm2 restart nest-app
```

5. 部署前端

将 `frontend/dist` 目录部署到 Web 服务器（如 Nginx、Apache），或使用静态托管服务（如 Vercel、Netlify）。

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 环境变量说明

### 后端环境变量

```env
# 服务器配置
PORT=3000
NODE_ENV=production

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=email_scheduler
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT 配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# 邮件服务配置
MAIL_HOST=smtp.qq.com
MAIL_PORT=587
MAIL_USER=your_email@qq.com
MAIL_PASSWORD=your_email_password
MAIL_FROM=your_email@qq.com

# 天气 API 配置
WEATHER_API_KEY=your_weather_api_key
```

## 开发指南

### 后端开发

```bash
# 代码格式化
npm run format

# 代码检查
npm run lint

# 运行测试
npm test

# 测试覆盖率
npm run test:cov
```

### 前端开发

```bash
# 代码检查
npm run lint
```

## API 文档

启动后端服务后，访问 `http://localhost:3000/api` 查看 Swagger API 文档。

主要接口：

- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `GET /templates` - 获取邮件模板列表
- `POST /templates` - 创建邮件模板
- `GET /tasks` - 获取定时任务列表
- `POST /tasks` - 创建定时任务
- `POST /tasks/:id/start` - 启动任务
- `POST /tasks/:id/pause` - 暂停任务
- `GET /logs` - 获取执行日志

## 许可证

MIT
