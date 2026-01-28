import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../features/auth';
import HomePage from '../pages/Home';
import LoginPage from '../pages/Login';
import EmailListPage from '../pages/EmailList';
import NotFoundPage from '../pages/NotFound';

/**
 * 应用路由配置
 *
 * 集中管理所有路由,便于维护
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* 根路径重定向到仪表盘 */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 登录页面 */}
      <Route path="/login" element={<LoginPage />} />

      {/* 受保护的路由 */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <ProtectedRoutes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

/**
 * 受保护的路由组
 * 需要登录后才能访问
 */
function ProtectedRoutes() {
  return (
    <Routes>
      {/* 仪表盘 */}
      <Route path="/dashboard" element={<HomePage />} />

      {/* 邮件管理 */}
      <Route path="/emails" element={<EmailListPage />} />

      {/* 404页面 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
