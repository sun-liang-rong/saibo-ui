/**
 * Home Page - 仪表盘
 *
 * 从App.jsx中的Dashboard组件迁移而来
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Progress, Button, Space } from 'antd';
import {
  MailOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { emailApi } from '../../features/email';

/**
 * 仪表盘页面组件
 */
export default function HomePage() {
  const navigate = useNavigate();

  // TODO: 添加状态管理和数据加载逻辑
  // 这里暂时使用静态数据,后续可以从features/email/hooks中获取

  const statsCards = [
    {
      title: '总任务数',
      value: 0,
      color: '#1890ff',
      icon: <MailOutlined style={{ fontSize: 24 }} />,
      suffix: '个',
    },
    {
      title: '待发送',
      value: 0,
      color: '#faad14',
      icon: <ClockCircleOutlined style={{ fontSize: 24 }} />,
      suffix: '个',
    },
    {
      title: '已发送',
      value: 0,
      color: '#52c41a',
      icon: <CheckOutlined style={{ fontSize: 24 }} />,
      suffix: '个',
    },
    {
      title: '发送失败',
      value: 0,
      color: '#ff4d4f',
      icon: <CloseOutlined style={{ fontSize: 24 }} />,
      suffix: '个',
    },
  ];

  return (
    <div>
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

      {/* 快速操作 */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title="快速操作"
            bordered={false}
            style={{ borderRadius: '8px' }}
            bodyStyle={{ padding: '24px' }}
          >
            <Space size="large">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => navigate('/emails')}
              >
                创建新任务
              </Button>
              <Button
                icon={<MailOutlined />}
                size="large"
                onClick={() => navigate('/emails')}
              >
                查看任务列表
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
