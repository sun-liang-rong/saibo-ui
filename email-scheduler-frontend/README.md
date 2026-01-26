# 定时邮件发送系统 - 前端

基于 React + Vite + Ant Design 开发的定时邮件发送系统前端应用。

## 功能特性

### 认证功能
- ✅ 用户登录（用户名 + 密码）
- ✅ JWT Token 认证
- ✅ 路由保护（未登录自动跳转）
- ✅ Token 自动管理
- ✅ 退出登录

### 邮件功能
- ✅ 创建定时邮件任务
- ✅ 查看邮件任务列表（分页、筛选）
- ✅ 查看邮件详情
- ✅ 编辑待发送的任务
- ✅ 删除未发送的任务
- ✅ 实时状态更新（每 30 秒自动刷新）
- ✅ 响应式设计，支持移动端
- ✅ 完整的表单验证
- ✅ 友好的错误提示

## 技术栈

- **框架**: React 18
- **路由**: React Router v6
- **构建工具**: Vite 5
- **UI 组件库**: Ant Design 5
- **HTTP 客户端**: Axios
- **日期处理**: Day.js
- **图标**: @ant-design/icons

## 项目结构

```
email-scheduler-frontend/
├── src/
│   ├── components/          # 组件
│   │   ├── EmailTaskForm.jsx       # 邮件任务表单
│   │   ├── EmailTaskList.jsx       # 邮件任务列表
│   │   ├── EmailDetailModal.jsx    # 邮件详情模态框
│   │   ├── LoginPage.jsx           # 登录页面
│   │   ├── HomePage.jsx            # 首页
│   │   └── ProtectedRoute.jsx      # 路由保护
│   ├── contexts/            # 上下文
│   │   └── AuthContext.jsx         # 认证上下文
│   ├── services/            # 服务层
│   │   ├── api.js                  # Axios 配置
│   │   ├── emailService.js         # 邮件服务 API
│   │   └── authService.js          # 认证服务 API
│   ├── App.jsx              # 主应用组件
│   ├── App.css              # 全局样式
│   ├── main.jsx             # 应用入口
│   └── index.css            # 基础样式
├── index.html
├── vite.config.js           # Vite 配置
├── package.json
├── FRONTEND_LOGIN_GUIDE.md  # 登录功能文档
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
cd email-scheduler-frontend
npm install
```

### 2. 配置后端 API

确保后端服务已启动（默认运行在 http://localhost:3000）

前端通过 Vite 代理访问后端 API，配置在 `vite.config.js`:

```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5173 启动

### 4. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录

### 5. 预览生产构建

```bash
npm run preview
```

## 功能说明

### 1. 创建邮件任务

点击"创建新任务"按钮，填写以下信息：

- **收件人邮箱**: 目标邮箱地址（格式验证）
- **邮件标题**: 邮件主题（最多 500 字符）
- **邮件内容**: 支持 HTML 格式
- **发送时间**: 必须选择未来的时间

表单验证规则：

- 收件人邮箱：必填，必须为有效的邮箱格式
- 邮件标题：必填，最多 500 字符
- 邮件内容：必填
- 发送时间：必填，必须为未来时间

### 2. 查看任务列表

任务列表显示所有邮件任务，包括：

- **基本信息**: ID、收件人、标题、发送时间
- **状态标识**: 待发送（蓝色）、已发送（绿色）、发送失败（红色）、重试中（橙色）
- **操作按钮**: 查看详情、编辑、删除

列表功能：

- 分页浏览
- 按状态筛选
- 自动刷新（每 30 秒）
- 手动刷新

### 3. 编辑任务

- 只能编辑"待发送"状态的任务
- 点击编辑按钮打开编辑表单
- 修改后点击"更新"按钮保存

### 4. 删除任务

- 只能删除"待发送"或"发送失败"状态的任务
- 点击删除按钮，确认后删除
- 已发送的任务不能删除

### 5. 查看详情

点击"查看详情"按钮，可以查看：

- 完整的邮件内容（HTML 渲染）
- 发送时间和实际发送时间
- 状态和重试次数
- 错误信息（如果发送失败）
- 创建和更新时间

## API 接口

### 创建邮件任务

**请求**:

```http
POST /api/emails
Content-Type: application/json

{
  "to_email": "user@example.com",
  "subject": "邮件标题",
  "content": "<h1>邮件内容</h1>",
  "send_time": "2024-12-31T10:30:00Z"
}
```

**响应**:

```json
{
  "id": 1,
  "to_email": "user@example.com",
  "subject": "邮件标题",
  "content": "<h1>邮件内容</h1>",
  "send_time": "2024-12-31T10:30:00.000Z",
  "status": "pending",
  "retry_count": 0,
  "error_message": null,
  "sent_at": null,
  "created_at": "2024-12-30T10:00:00.000Z",
  "updated_at": "2024-12-30T10:00:00.000Z"
}
```

### 获取邮件列表

**请求**:

```http
GET /api/emails?page=1&limit=10&status=pending
```

**响应**:

```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

### 删除邮件任务

**请求**:

```http
DELETE /api/emails/:id
```

**响应**: 204 No Content

## 字段说明

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| id | number | 邮件任务 ID | 1 |
| to_email | string | 收件人邮箱 | user@example.com |
| subject | string | 邮件标题 | 测试邮件 |
| content | string | 邮件内容（HTML） | `<h1>内容</h1>` |
| send_time | string | 定时发送时间 | 2024-12-31T10:30:00Z |
| status | string | 发送状态 | pending/sent/failed/retrying |
| retry_count | number | 重试次数 | 0 |
| error_message | string \| null | 错误信息 | null |
| sent_at | string \| null | 实际发送时间 | null |
| created_at | string | 创建时间 | 2024-12-30T10:00:00Z |
| updated_at | string | 更新时间 | 2024-12-30T10:00:00Z |

## 状态说明

- **pending**: 待发送，任务已创建，等待发送
- **sent**: 已发送，邮件成功发送
- **failed**: 发送失败，邮件发送失败且重试次数已用尽
- **retrying**: 重试中，正在进行重试

## 部署

### 构建

```bash
npm run build
```

### 使用 Nginx 部署

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/email-scheduler-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 使用 Docker 部署

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 开发说明

### 添加新功能

1. 在 `src/services/` 中添加 API 方法
2. 在 `src/components/` 中创建组件
3. 在 `App.jsx` 中使用组件

### 样式定制

全局样式在 `src/App.css` 中定义。

Ant Design 主题定制在 `src/main.jsx` 中通过 ConfigProvider 配置。

### 环境变量

可以在 `.env` 文件中配置环境变量：

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 常见问题

### 1. 无法连接到后端

- 确认后端服务已启动
- 检查 Vite 代理配置是否正确
- 查看浏览器控制台的网络请求

### 2. 表单验证失败

- 检查所有必填项是否已填写
- 确认邮箱格式是否正确
- 确认发送时间为未来时间

### 3. 任务列表不更新

- 点击"刷新"按钮手动刷新
- 系统会每 30 秒自动刷新
- 检查网络连接是否正常

## License

MIT
