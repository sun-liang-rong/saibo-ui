import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Breadcrumb, Tooltip } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MailOutlined,
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ProLayout.css';
const { Header, Sider, Content } = Layout;

/**
 * 专业后台管理布局组件
 *
 * 特性：
 * - 可折叠侧边栏
 * - 顶部操作栏
 * - 面包屑导航
 * - 内容区卡片化
 */
const ProLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * 侧边栏菜单项
   */
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/emails',
      icon: <MailOutlined />,
      label: '邮件任务',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  /**
   * 用户下拉菜单
   */
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账号设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  /**
   * 处理菜单点击
   */
  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  /**
   * 获取当前面包屑
   */
  const getBreadcrumb = () => {
    const pathMap = {
      '/': ['仪表盘'],
      '/emails': ['邮件任务'],
      '/settings': ['系统设置'],
    };

    return pathMap[location.pathname] || ['首页'];
  };

  return (
    <Layout className={`pro-layout ${collapsed ? 'pro-layout-sider-collapsed' : ''}`}>
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="pro-sider"
        width={256}
        collapsedWidth={64}
        theme="light"
      >
        {/* Logo 区域 */}
        <div className="pro-logo">
          <div className="logo-icon">
            <MailOutlined />
          </div>
          {!collapsed && (
            <div className="logo-text">
              <div className="logo-title">邮件调度系统</div>
              <div className="logo-subtitle">Email Scheduler</div>
            </div>
          )}
        </div>

        {/* 导航菜单 */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="pro-menu"
        />
      </Sider>

      {/* 主体区域 */}
      <Layout className="pro-layout-main">
        {/* 顶部 Header */}
        <Header className="pro-header">
          <div className="header-left">
            {/* 折叠按钮 */}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="collapse-btn"
            />

            {/* 面包屑 */}
            <Breadcrumb
              items={getBreadcrumb().map((item) => ({ title: item }))}
              className="header-breadcrumb"
            />
          </div>

          <div className="header-right">
            {/* 搜索 */}
            <Tooltip title="搜索（Cmd+K）">
              <Button
                type="text"
                icon={<SearchOutlined />}
                className="header-action-btn"
              />
            </Tooltip>

            {/* 通知 */}
            <Tooltip title="通知">
              <Button
                type="text"
                icon={<BellOutlined />}
                className="header-action-btn"
              />
            </Tooltip>

            {/* 用户信息 */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <div className="user-info">
                <Avatar icon={<UserOutlined />} className="user-avatar" />
                <span className="user-name">{user?.username || 'Admin'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* 内容区域 */}
        <Content className="pro-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProLayout;
