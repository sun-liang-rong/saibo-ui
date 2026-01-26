import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext';

/**
 * 路由保护组件
 *
 * 功能：
 * 1. 检查用户是否已登录
 * 2. 未登录则跳转到登录页
 * 3. 已登录则渲染子组件
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子组件
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // 加载中
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  // 未登录，跳转到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 已登录，渲染子组件
  return children;
};

export default ProtectedRoute;
