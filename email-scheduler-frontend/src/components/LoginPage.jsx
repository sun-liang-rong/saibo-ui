import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
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
      <div className="login-container">
        <Card className="login-card">
          <div className="login-header">
            <Title level={2}>定时邮件发送系统</Title>
            <Text type="secondary">请登录以继续</Text>
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
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          <div className="login-footer">
            <Text type="secondary" style={{ fontSize: 12 }}>
              默认账号：admin / admin123
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
