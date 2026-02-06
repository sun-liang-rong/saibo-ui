import React from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space, Divider } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  FileTextOutlined,
  ScheduleOutlined,
  HistoryOutlined,
  LogoutOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
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
  ];

  const userMenuItems = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={260}
        style={{
          background: '#1e293b',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
        trigger={null}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#fff',
                }}
              >
                M
              </div>
              <div>
                <div
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  MailFlow
                </div>
                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: 11,
                    fontWeight: 400,
                  }}
                >
                  邮件调度系统
                </div>
              </div>
            </div>
          )}
          {collapsed && (
            <div
              style={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 'bold',
                color: '#fff',
              }}
            >
              M
            </div>
          )}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            background: 'transparent',
            border: 'none',
            paddingTop: 16,
          }}
          inlineIndent={20}
        />
        
        {!collapsed && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 16,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                color: '#94a3b8',
                fontSize: 12,
                textAlign: 'center',
              }}
            >
              © 2024 MailFlow
            </div>
          </div>
        )}
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 64,
            borderBottom: '1px solid #e2e8f0',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: 16,
              color: '#64748b',
              width: 40,
              height: 40,
            }}
          />
          
          <Space size={24}>
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{
                color: '#64748b',
                width: 40,
                height: 40,
                borderRadius: 8,
              }}
            />
            <Divider type="vertical" style={{ margin: 0 }} />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 8,
                  transition: 'background-color 0.2s',
                }}
              >
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      color: '#1e293b',
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: 1.2,
                    }}
                  >
                    管理员
                  </span>
                  <span
                    style={{
                      color: '#94a3b8',
                      fontSize: 12,
                      lineHeight: 1.2,
                    }}
                  >
                    admin
                  </span>
                </div>
              </div>
            </Dropdown>
          </Space>
        </Header>
        
        <Content
          style={{
            padding: 24,
            minHeight: 'calc(100vh - 64px)',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              padding: 24,
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
              minHeight: 'calc(100vh - 112px)',
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
