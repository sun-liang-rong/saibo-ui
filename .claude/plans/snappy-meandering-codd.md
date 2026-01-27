# 侧边栏折叠功能修复计划

## 问题概述

当用户点击折叠按钮折叠侧边栏时（从 256px 变为 64px），Header 的宽度没有相应调整，导致布局不协调。

## 修复方案

采用**动态 width 方案**，通过 CSS `calc()` 函数计算父容器和 Header 的宽度，确保 Header 宽度跟随侧边栏折叠状态自动调整。

## 修改文件

### 主要修改文件

**C:\Users\qd-sunliangrong\Desktop\zujian\email-scheduler-frontend\src\components\ProLayout.css**

需要修改 4 处 CSS 规则：

#### 修改 1：第 121-127 行 - `.pro-layout-main` 样式

**当前代码**：
```css
.pro-layout-main {
  margin-left: 256px;
  transition: margin-left 0.2s;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
```

**修改为**：
```css
.pro-layout-main {
  margin-left: 256px;
  transition: margin-left 0.2s;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: calc(100% - 256px);
}
```

#### 修改 2：第 129-131 行 - 折叠状态样式

**当前代码**：
```css
.pro-layout-sider-collapsed + .pro-layout-main {
  margin-left: 64px;
}
```

**修改为**：
```css
.pro-layout-sider-collapsed + .pro-layout-main {
  margin-left: 64px;
  width: calc(100% - 64px);
}
```

#### 修改 3：第 134-147 行 - `.pro-header` 样式

**在 `.pro-header` 样式中添加**：
```css
width: 100%;
```

确保完整的样式如下：
```css
.pro-header {
  background: #fff !important;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 24px !important;
  height: 64px !important;
  line-height: 64px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: sticky;
  top: 0;
  z-index: 999;
  width: 100%;
}
```

#### 修改 4：第 259-267 行 - 移动端响应式样式

**在 `@media (max-width: 991px)` 中修改**：

**当前代码**：
```css
.pro-layout-main {
  margin-left: 0 !important;
}
```

**修改为**：
```css
.pro-layout-main {
  margin-left: 0 !important;
  width: 100% !important;
}
```

## 技术原理

### 为什么需要显式设置 width？

1. **Sticky 定位的特性**：
   - `position: sticky` 的元素会脱离正常文档流
   - 其宽度由父容器决定，但不会自动响应父容器的 margin 变化

2. **Width 的计算逻辑**：
   - 当元素设置 `margin-left: 256px` 时，`width: 100%` 仍然是视口宽度的 100%
   - 需要使用 `calc(100% - 256px)` 才能让元素实际占据剩余空间
   - 这样 Header 宽度 = 视口宽度 - 左边距

3. **继承关系**：
   - `.pro-layout-main` 设置正确的 width
   - Header 设置 `width: 100%` 继承父容器宽度
   - 实现宽度跟随效果

## 预期效果

修复后的行为：

1. **侧边栏展开时**：
   - 主内容区：`margin-left: 256px; width: calc(100% - 256px)`
   - Header：`width: 100%`（继承父容器）

2. **侧边栏折叠时**：
   - 主内容区：`margin-left: 64px; width: calc(100% - 64px)`
   - Header：`width: 100%`（继承父容器）

3. **过渡动画**：
   - 由于 `transition: margin-left 0.2s` 的存在，宽度变化会有流畅的动画
   - Header 宽度平滑过渡，无卡顿

## 验证步骤

修复后需要验证以下功能点：

1. ✅ 点击折叠按钮，Header 宽度立即响应
2. ✅ Header 始终与右侧边界对齐
3. ✅ 过渡动画流畅（0.2s）
4. ✅ Sticky 定位效果保持（滚动时 Header 固定在顶部）
5. ✅ 移动端响应式布局正常
6. ✅ 在仪表盘和邮件任务列表页面都测试

## 测试命令

```bash
cd email-scheduler-frontend
npm run dev
```

访问 http://localhost:5173 进行测试。
