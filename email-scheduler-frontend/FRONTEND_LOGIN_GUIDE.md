# 前端登录功能使用文档

## 功能概述

前端已完成用户登录功能，包括登录页面、路由保护、Token 管理等功能。

## 功能特性

- ✅ 用户登录（用户名 + 密码）
- ✅ Token 自动存储（localStorage）
- ✅ Token 自动添加到请求头
- ✅ 路由保护（未登录自动跳转登录页）
- ✅ 401 自动处理（清除 Token 并跳转登录页）
- ✅ 退出登录功能
- ✅ 用户信息显示
- ✅ 美观的登录界面

## 新增依赖

需要安装 `react-router-dom`：

```bash
npm install react-router-dom
```

## 文件结构

```
src/
├── components/
│   ├── LoginPage.jsx           # 登录页面组件
│   ├── LoginPage.css           # 登录页面样式
│   ├── HomePage.jsx            # 首页组件
│   └── ProtectedRoute.jsx      # 路由保护组件
├── contexts/
│   └── AuthContext.jsx         # 认证上下文
├── services/
│   ├── api.js                  # Axios 配置（已更新）
│   └── authService.js          # 认证服务
└── App.jsx                     # 主应用（已更新）
```

## API 接口

### 登录接口

**请求：**

```bash
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**响应：**

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

## 使用说明

### 1. 登录流程

1. 访问应用首页（http://localhost:5173）
2. 如果未登录，自动跳转到登录页
3. 输入用户名和密码
4. 点击"登录"按钮
5. 登录成功后跳转回首页

### 2. 默认账号

```
用户名：admin
密码：admin123
```

### 3. 退出登录

点击右上角的用户头像，选择"退出登录"

## 核心功能说明

### 1. 认证上下文

提供全局的登录状态管理：

```javascript
import { useAuth } from '../contexts/AuthContext';

const { user, isAuthenticated, login, logout } = useAuth();
```

**API：**

- `user`: 当前用户信息
- `isAuthenticated`: 是否已登录
- `loading`: 加载状态
- `login(username, password)`: 登录函数
- `logout()`: 退出登录函数
- `updateUser(newUser)`: 更新用户信息

### 2. Token 管理

自动管理 JWT Token：

```javascript
import { tokenStorage } from '../services/authService';

// 保存 token
tokenStorage.setToken(token);

// 获取 token
const token = tokenStorage.getToken();

// 清除 token
tokenStorage.clear();

// 检查是否已登录
const isAuth = tokenStorage.isAuthenticated();
```

### 3. Axios 拦截器

**请求拦截器：**

自动添加 Token 到请求头：

```javascript
// 所有请求都会自动添加 Authorization header
// Authorization: Bearer <token>
```

**响应拦截器：**

处理 401 错误，自动清除 Token 并跳转到登录页：

```javascript
// 当收到 401 响应时：
// 1. 清除 localStorage 中的 token
// 2. 跳转到登录页
```

### 4. 路由保护

使用 `ProtectedRoute` 组件保护需要登录的路由：

```javascript
<Route
  path="/"
  element={
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  }
/>
```

### 5. 登录页面组件

**功能：**

- 用户名和密码输入
- 表单验证
- 登录按钮（loading 状态）
- 错误提示
- 美观的渐变背景

## 自定义和扩展

### 修改默认登录页

编辑 `src/components/LoginPage.jsx`：

```javascript
// 修改标题
<Title level={2}>您的系统名称</Title>

// 修改默认账号提示
<Text>默认账号：your_username / your_password</Text>
```

### 修改 Token 过期时间

后端配置（`.env`）：

```env
JWT_EXPIRES_IN=1h
```

### 添加记住密码功能

在 `LoginPage.jsx` 中添加：

```javascript
const [remember, setRemember] = useState(false);

// 在 Form 中添加
<Form.Item>
  <Form.Item name="remember" valuePropName="checked" noStyle>
    <Checkbox>记住密码</Checkbox>
  </Form.Item>
</Form.Item>
```

### 添加忘记密码功能

在登录页面添加"忘记密码"链接：

```javascript
<div style={{ textAlign: 'right' }}>
  <Link to="/forgot-password">忘记密码？</Link>
</div>
```

## 安全建议

1. **使用 HTTPS**
   - 生产环境必须使用 HTTPS
   - 防止 Token 被窃取

2. **Token 存储**
   - 当前使用 localStorage
   - 可考虑使用 httpOnly cookie（更安全）

3. **密码强度**
   - 建议添加密码强度验证
   - 提供密码强度指示器

4. **登录限流**
   - 后端实现登录次数限制
   - 防止暴力破解

5. **CSRF 防护**
   - 实现 CSRF token
   - 防止跨站请求伪造

## 常见问题

### 1. 登录后刷新页面，又跳转到登录页

**原因：** Token 未正确保存或读取

**解决方法：**
- 检查浏览器 localStorage 是否有 token
- 检查 tokenStorage 的实现
- 确认 AuthContext 的初始化逻辑

### 2. 请求时没有携带 Token

**原因：** Axios 拦截器未生效

**解决方法：**
- 确认 `api.js` 中的请求拦截器已正确配置
- 检查 Token 是否已保存到 localStorage
- 查看浏览器 Network 面板的请求头

### 3. 401 错误没有自动跳转登录页

**原因：** 响应拦截器未生效

**解决方法：**
- 确认 `api.js` 中的响应拦截器已正确配置
- 检查 401 错误处理逻辑
- 确认当前不在登录页（避免死循环）

### 4. 登录成功但页面没有跳转

**原因：** 路由跳转失败

**解决方法：**
- 检查 navigate 函数是否正确调用
- 确认路由配置正确
- 查看浏览器控制台是否有错误

## 测试步骤

1. **启动后端服务**

```bash
cd email-scheduler
npm run start:dev
```

2. **启动前端服务**

```bash
cd email-scheduler-frontend
npm install
npm run dev
```

3. **测试登录**

- 访问 http://localhost:5173
- 自动跳转到登录页
- 输入用户名：`admin`
- 输入密码：`admin123`
- 点击登录
- 成功跳转到首页

4. **测试 Token 自动添加**

- 打开浏览器开发者工具
- 切换到 Network 面板
- 查看任意 API 请求
- 确认请求头包含 `Authorization: Bearer <token>`

5. **测试路由保护**

- 清除 localStorage
- 刷新页面
- 自动跳转到登录页

6. **测试退出登录**

- 点击右上角用户头像
- 选择"退出登录"
- 跳转到登录页
- 无法直接访问首页

## 完整示例

### 在其他组件中使用认证信息

```javascript
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from 'antd';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>请先登录</div>;
  }

  return (
    <div>
      <p>欢迎，{user.username}！</p>
      <Button onClick={logout}>退出登录</Button>
    </div>
  );
};

export default MyComponent;
```

### 调用需要认证的 API

```javascript
import { getEmailTasks } from '../services/emailService';

const loadEmails = async () => {
  try {
    // Token 会自动添加到请求头
    const response = await getEmailTasks();
    console.log(response);
  } catch (error) {
    console.error('加载失败:', error);
  }
};
```

## 下一步扩展

- [ ] 添加注册页面
- [ ] 实现忘记密码功能
- [ ] 添加密码强度验证
- [ ] 实现记住密码功能
- [ ] 添加多语言支持
- [ ] 实现角色权限管理
- [ ] 添加登录日志
- [ ] 实现 Token 刷新机制
