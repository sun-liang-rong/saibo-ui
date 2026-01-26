import React from 'react';
import { Layout, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import EmailTaskList from './EmailTaskList';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

/**
 * 首页组件
 *
 * 显示欢迎信息和邮件任务列表
 */
const HomePage = () => {
  return (
    <>
      <Content style={{ padding: '24px 50px', background: '#f0f2f5' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* 欢迎卡片 */}
          <div style={{
            background: '#fff',
            padding: '24px 32px',
            borderRadius: 8,
            marginBottom: 24,
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            <Title level={3} style={{ marginBottom: 8 }}>
              欢迎使用定时邮件发送系统
            </Title>
            <Text style={{ color: '#666', fontSize: 14 }}>
              创建和管理您的定时邮件任务，系统将在指定时间自动发送邮件
            </Text>
            <div style={{ marginTop: 16, color: '#999', fontSize: 12 }}>
              <ClockCircleOutlined /> 自动刷新：每 30 秒更新一次任务状态
            </div>
          </div>

          {/* 邮件任务列表 */}
          <EmailTaskList />
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff' }}>
        <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
          定时邮件发送系统 ©{new Date().getFullYear()} - 基于 React + NestJS 构建
        </Text>
      </Footer>
    </>
  );
};

export default HomePage;
