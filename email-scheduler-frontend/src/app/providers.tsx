import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * 全局 Provider 配置
 *
 * 集中管理所有全局 Provider
 */

// 创建 React Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5分钟
    },
  },
});

/**
 * AppProviders 组件
 *
 * 包装所有全局 Provider
 */
export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
