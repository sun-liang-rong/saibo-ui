import React from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  FileTextOutlined,
  ScheduleOutlined,
  HistoryOutlined,
  LogoutOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider style={{height: '100vh'}} collapsible>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: borderRadiusLG }} >
          定时邮件系统
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: '/templates',
              icon: <FileTextOutlined />,
              label: '邮件模板',
              onClick: () => navigate('/templates'),
            },
            {
              key: '/tasks',
              icon: <ScheduleOutlined />,
              label: '定时任务',
              onClick: () => navigate('/tasks'),
            },
            {
              key: '/history',
              icon: <HistoryOutlined />,
              label: '执行历史',
              onClick: () => navigate('/history'),
            },
            {
              key: '/douyin',
              icon: <VideoCameraOutlined />,
              label: '抖音去水印',
              onClick: () => navigate('/douyin'),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            退出登录
          </Button>
        </Header>
        <Content style={{ margin: '16px', height: 'calc(100vh - 64px - 32px)', overflow: 'auto' }}>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
