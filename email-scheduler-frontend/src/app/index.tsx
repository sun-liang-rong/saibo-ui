import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider } from '../features/auth';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import '../styles/global.css';

/**
 * 应用主组件
 *
 * 负责配置全局Provider和路由
 */
export default function App() {
  return (
    <BrowserRouter>
      <ConfigProvider locale={zhCN}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
}
