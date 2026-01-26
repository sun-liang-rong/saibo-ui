import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Typography, message, Spin, Button, Dropdown, Avatar } from 'antd';
import {
  MailOutlined,
  ClockCircleOutlined,
  ApiOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import { getHealthCheck } from './services/emailService';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

/**
 * 主应用布局组件
 *
 * 包含头部导航和主要内容区
 */
function AppLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const [healthStatus, setHealthStatus] = useState('checking');

  /**
   * 检查后端服务健康状态
   */
  const checkHealth = async () => {
    try {
      const response = await getHealthCheck();
      if (response.status === 'ok') {
        setHealthStatus('ok');
      }
    } catch (error) {
      console.error('后端服务连接失败:', error);
      setHealthStatus('error');
      message.error('无法连接到后端服务');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkHealth();
    }
  }, [isAuthenticated]);

  /**
   * 退出登录
   */
  const handleLogout = () => {
    logout();
    message.success('已退出登录');
  };

  /**
   * 用户下拉菜单
   */
  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  /**
   * 渲染头部
   */
  const renderHeader = () => (
    <Header style={{ background: '#001529', padding: '0 50px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MailOutlined style={{ fontSize: 24, color: '#fff', marginRight: 16 }} />
          <Title level={3} style={{ color: '#fff', margin: 0 }}>
            定时邮件发送系统
          </Title>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* 服务状态 */}
          <div style={{ color: '#fff' }}>
            {healthStatus === 'ok' && (
              <Text style={{ color: '#52c41a' }}>
                <ApiOutlined /> 服务正常
              </Text>
            )}
            {healthStatus === 'error' && (
              <Text style={{ color: '#f5222d' }}>
                <ApiOutlined /> 服务异常
              </Text>
            )}
          </div>

          {/* 用户信息 */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} />
              <Text style={{ color: '#fff' }}>{user?.username}</Text>
            </div>
          </Dropdown>
        </div>
      </div>
    </Header>
  );

  /**
   * 渲染错误状态
   */
  if (healthStatus === 'error') {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        {renderHeader()}
        <Content style={{ padding: '50px', background: '#fff' }}>
          <div style={{
            maxWidth: 800,
            margin: '0 auto',
            textAlign: 'center',
            padding: 50
          }}>
            <div style={{ fontSize: 72, color: '#f5222d', marginBottom: 24 }}>
              ⚠️
            </div>
            <Title level={2}>无法连接到后端服务</Title>
            <Text style={{ fontSize: 16, color: '#666' }}>
              请确认以下事项：
            </Text>
            <ul style={{ textAlign: 'left', marginTop: 24, fontSize: 14, color: '#666' }}>
              <li>后端服务已启动（npm run start:dev）</li>
              <li>后端服务运行在 http://localhost:3000</li>
              <li>前端代理配置正确（vite.config.js）</li>
              <li>网络连接正常</li>
            </ul>
            <div style={{ marginTop: 32 }}>
              <Button type="primary" onClick={checkHealth}>
                重新连接
              </Button>
            </div>
          </div>
        </Content>
      </Layout>
    );
  }

  /**
   * 渲染正常内容
   */
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {renderHeader()}
      <HomePage />
    </Layout>
  );
}

/**
 * 主应用组件
 *
 * 功能：
 * 1. 提供路由配置
 * 2. 提供认证上下文
 * 3. 路由保护
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 登录页 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 受保护的路由 */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
