import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

const { Title, Text } = Typography;

/**
 * 登录页面组件
 *
 * 功能：
 * 1. 用户登录（用户名 + 密码）
 * 2. 表单验证
 * 3. 登录成功后跳转到首页
 * 4. 错误提示
 */
const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * 提交登录表单
   */
  const handleSubmit = async (values) => {
    const { username, password } = values;

    setLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        message.success('登录成功！');
        // 跳转到首页
        navigate('/');
      } else {
        message.error(result.message || '登录失败');
      }
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* 背景装饰 */}
      <div className="login-bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="login-container">
        <Card className="login-card fade-in">
          <div className="login-header">
            <div className="login-icon">
              <MailOutlined />
            </div>
            <Title level={2} className="login-title">
              定时邮件发送系统
            </Title>
            <Text className="login-subtitle">Email Scheduler</Text>
            <Text type="secondary" className="login-description">
              请使用您的账号登录系统
            </Text>
          </div>

          <Form
            name="login"
            onFinish={handleSubmit}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            {/* 用户名 */}
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
              />
            </Form.Item>

            {/* 密码 */}
            <Form.Item
              label="密码"
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
              />
            </Form.Item>

            {/* 提交按钮 */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                登 录
              </Button>
            </Form.Item>
          </Form>

          <div className="login-footer">
            <div className="login-tips">
              <Text type="secondary" style={{ fontSize: 13 }}>
                💡 测试账号：admin / admin123
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
