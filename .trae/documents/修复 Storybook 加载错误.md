我已修复了 Storybook 加载失败的问题。

### 问题原因
Storybook 的配置过于宽泛，错误地将 `packages/ui/stories/index.tsx`（这是一个导出文件，不是 Story 文件）识别为 Story 文件并尝试解析，导致了 "Invariant failed: No matching indexer found" 错误。

### 修复方案
我更新了 `packages/ui/.storybook/main.ts` 中的 `stories` 配置，使其更精确地匹配文件：

**修改前：**
```typescript
stories: ['../src/**/*.stories.*', '../stories/**/*.stories.*', '../stories/**/*']
```

**修改后：**
```typescript
stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)']
```

这一修改排除了非 Story 文件（如 `index.tsx`），同时保留了所有有效的 Story 文件。

### 验证
我已经重启了 Storybook 服务。请刷新浏览器中的 Storybook 页面 (**http://localhost:6007**)，现在应该可以正常加载所有组件文档了。