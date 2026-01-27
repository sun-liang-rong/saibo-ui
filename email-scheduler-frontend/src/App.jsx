import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { message, ConfigProvider, Card, Row, Col, Statistic, Progress, List, Tag, Button, Space } from 'antd';
import {
  MailOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import ProLayout from './components/ProLayout';
import EmailTaskList from './components/EmailTaskList';
import { getHealthCheck, getEmailTotal } from './services/emailService';
import './App.css';
import zhCN from 'antd/locale/zh_CN';

/**
 * 仪表盘组件 - 简洁专业风格
 */
const Dashboard = () => {
  const [emailTotal, setEmailTotal] = useState({
    total: 0,
    pending: 0,
    sent: 0,
    failed: 0,
    retrying: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmailTotal();
  }, []);

  const loadEmailTotal = async () => {
    try {
      const response = await getEmailTotal();
      setEmailTotal(response);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: '总任务数',
      value: emailTotal.total,
      color: '#1890ff',
      icon: <MailOutlined style={{ fontSize: 24 }} />,
      suffix: '个',
    },
    {
      title: '待发送',
      value: emailTotal.pending,
      color: '#faad14',
      icon: <ClockCircleOutlined style={{ fontSize: 24 }} />,
      suffix: '个',
    },
    {
      title: '已发送',
      value: emailTotal.sent,
      color: '#52c41a',
      icon: <CheckOutlined style={{ fontSize: 24 }} />,
      suffix: '个',
    },
    {
      title: '发送失败',
      value: emailTotal.failed,
      color: '#ff4d4f',
      icon: <CloseOutlined style={{ fontSize: 24 }} />,
      suffix: '个',
    },
  ];

  const successRate = emailTotal.total > 0
    ? Math.round((emailTotal.sent / emailTotal.total) * 100)
    : 0;

  const quickActions = [
    {
      title: '创建新任务',
      description: '快速创建邮件调度任务',
      icon: <PlusOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
      action: () => window.location.href = '/emails',
    },
    {
      title: '查看任务列表',
      description: '管理所有邮件任务',
      icon: <MailOutlined style={{ fontSize: 20, color: '#52c41a' }} />,
      action: () => window.location.href = '/emails',
    },
    {
      title: '系统设置',
      description: '配置系统参数',
      icon: <SettingOutlined style={{ fontSize: 20, color: '#8c8c8c' }} />,
      action: () => window.location.href = '/settings',
    },
  ];

  const recentActivities = [
    {
      title: '系统启动成功',
      time: '刚刚',
      type: 'success',
    },
    {
      title: '后端服务连接正常',
      time: '1分钟前',
      type: 'info',
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'rgba(0,0,0,0.85)', margin: 0, marginBottom: '8px' }}>
          仪表盘
        </h1>
        <p style={{ color: 'rgba(0,0,0,0.45)', fontSize: '14px', margin: 0 }}>
          欢迎使用邮件调度系统
        </p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statsCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              bordered={false}
              loading={loading}
              style={{ borderRadius: '8px' }}
              bodyStyle={{ padding: '24px' }}
              hoverable
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: '14px', marginBottom: '12px' }}>
                    {stat.title}
                  </div>
                  <div style={{ fontSize: '30px', fontWeight: 600, color: stat.color, lineHeight: 1 }}>
                    {stat.value}
                    <span style={{ fontSize: '14px', marginLeft: '4px', color: 'rgba(0,0,0,0.45)', fontWeight: 400 }}>
                      {stat.suffix}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    background: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 成功率和快速操作 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {/* 成功率卡片 */}
        <Col xs={24} lg={8}>
          <Card
            title="发送成功率"
            bordered={false}
            style={{ borderRadius: '8px', height: '100%' }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <Progress
                type="circle"
                percent={successRate}
                size={160}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                format={(percent) => (
                  <div>
                    <div style={{ fontSize: '32px', fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>
                      {percent}%
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.45)', marginTop: '8px' }}>
                      成功率
                    </div>
                  </div>
                )}
              />
              <div style={{ marginTop: '24px', color: 'rgba(0,0,0,0.65)', fontSize: '14px' }}>
                共发送 {emailTotal.total} 个任务，成功 {emailTotal.sent} 个
              </div>
            </div>
          </Card>
        </Col>

        {/* 快速操作卡片 */}
        <Col xs={24} lg={16}>
          <Card
            title="快速操作"
            bordered={false}
            style={{ borderRadius: '8px', height: '100%' }}
            bodyStyle={{ padding: '24px' }}
          >
            <Row gutter={[16, 16]}>
              {quickActions.map((action, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card
                    hoverable
                    onClick={action.action}
                    style={{ borderRadius: '6px' }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: '#f5f5f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {action.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(0,0,0,0.85)', marginBottom: '4px' }}>
                          {action.title}
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(0,0,0,0.45)' }}>
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 最近活动 */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title="最近活动"
            bordered={false}
            style={{ borderRadius: '8px' }}
            bodyStyle={{ padding: '24px' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item
                  style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: item.type === 'success' ? '#52c41a' : '#1890ff',
                          marginTop: '6px',
                        }}
                      />
                    }
                    title={
                      <span style={{ fontSize: '14px', color: 'rgba(0,0,0,0.85)' }}>
                        {item.title}
                      </span>
                    }
                    description={
                      <span style={{ fontSize: '13px', color: 'rgba(0,0,0,0.45)' }}>
                        {item.time}
                      </span>
                    }
                  />
                  <Tag color={item.type === 'success' ? 'success' : 'processing'}>
                    {item.type === 'success' ? '成功' : '信息'}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

/**
 * 内部应用布局组件（处理健康检查和错误状态）
 */
function AppLayoutContent() {
  const { isAuthenticated } = useAuth();
  const [healthStatus, setHealthStatus] = useState('checking');
  const location = useLocation();

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

  // 如果服务异常，显示错误页面
  if (healthStatus === 'error') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f7fa'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 48,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
          maxWidth: 600,
          textAlign: 'center'
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: '#fff2f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 40
          }}>
            ⚠️
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: '#1f2937', marginBottom: 12 }}>
            无法连接到后端服务
          </h2>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>
            请确认以下事项：
          </p>
          <ul style={{
            textAlign: 'left',
            display: 'inline-block',
            color: '#6b7280',
            marginBottom: 32,
            lineHeight: 2
          }}>
            <li>后端服务已启动（npm run start:dev）</li>
            <li>后端服务运行在 http://localhost:3000</li>
            <li>前端代理配置正确（vite.config.js）</li>
            <li>网络连接正常</li>
          </ul>
          <div>
            <button
              onClick={checkHealth}
              style={{
                background: '#1890ff',
                color: '#fff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#096dd9'}
              onMouseLeave={(e) => e.target.style.background = '#1890ff'}
            >
              重新连接
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProLayout>
      <Outlet />
    </ProLayout>
  );
}

/**
 * 主应用组件
 */
function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          colorBgContainer: '#fff',
          colorBgLayout: '#f5f7fa',
          colorTextBase: '#1f2937',
          colorTextSecondary: '#6b7280',
          colorBorder: '#e8e8e8',
          colorBorderSecondary: '#f0f0f0',
          fontSize: 14,
          fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif`,
        },
        components: {
          Layout: {
            headerBg: '#fff',
            headerHeight: 64,
            siderBg: '#fff',
          },
          Menu: {
            itemBorderRadius: 8,
            itemHeight: 40,
          },
        },
      }}
    >
      <AuthProvider>
        <Router>
          <Routes>
            {/* 登录页 */}
            <Route path="/login" element={<LoginPage />} />

            {/* 受保护的路由 */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayoutContent />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="emails" element={<EmailTaskList />} />
              <Route path="settings" element={<div>系统设置页面</div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
