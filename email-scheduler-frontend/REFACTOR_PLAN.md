# 前端项目重构计划

## 目标
将当前扁平化的项目结构重构为按功能模块化的现代项目结构

## 新目录结构
```
src/
├── app/                    # 应用配置
│   ├── App.tsx            # Dashboard组件(从App.jsx迁移)
│   ├── routes.tsx          # 路由配置
│   ├── providers.tsx       # 全局Provider
│   └── index.tsx          # 导出
│
├── pages/                  # 页面入口
│   ├── Home/              # 仪表盘页面
│   │   └── index.tsx
│   ├── Login/             # 登录页面
│   │   └── index.tsx
│   └── NotFound/          # 404页面
│       └── index.tsx
│
├── features/              # ⭐ 核心业务模块
│   ├── auth/              # 认证模块
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   ├── components/
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ProLayout.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   └── index.ts
│   │
│   └── email/            # 邮件模块
│       ├── api.ts
│       ├── hooks.ts
│       ├── components/
│       │   ├── EmailTaskList.tsx
│       │   ├── EmailTaskForm.tsx
│       │   └── EmailDetailModal.tsx
│       ├── template/
│       │   └── (所有模板文件)
│       └── index.ts
│
├── components/           # 通用组件(空)
│   └── index.ts
│
├── hooks/               # 通用hooks
│   └── index.ts
│
├── services/            # HTTP服务层
│   ├── http.ts
│   └── index.ts
│
├── utils/              # 工具函数
│   └── index.ts
│
├── styles/             # 全局样式
│   ├── variables.css
│   ├── reset.css
│   └── global.css (从index.css重命名)
│
├── types/              # TypeScript类型定义
│   └── index.d.ts
│
├── constants/          # 常量
│   └── index.ts
│
└── main.tsx            # 应用入口
```

## 迁移步骤

### 1. ✅ 创建目录结构
- [x] 创建所有空目录

### 2. ⏳ 创建features模块
- [ ] 迁移auth相关代码到features/auth
- [ ] 迁移email相关代码到features/email

### 3. ⏳ 创建pages
- [ ] 从App.jsx提取Dashboard到pages/Home
- [ ] 迁移LoginPage到pages/Login
- [ ] 创建NotFound页面

### 4. ⏳ 创建app配置
- [x] 创建app/routes.tsx
- [x] 创建app/providers.tsx
- [x] 创建app/index.tsx
- [ ] 从App.jsx提取Dashboard到app/App.tsx

### 5. ⏳ 更新main.jsx
- [ ] 使用新的app/index.tsx

### 6. ⏳ 测试
- [ ] 测试登录功能
- [ ] 测试邮件列表
- [ ] 测试邮件创建/编辑

## 注意事项
1. 保持所有功能正常工作
2. 不要删除旧文件,直到新文件完全可用
3. 逐步迁移,分步测试
