import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import request from '../utils/request';
import './Login.css';

interface LoginValues {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: LoginValues) => {
    try {
      const res = (await request.post('/auth/login', values)) as LoginResponse;
      localStorage.setItem('token', res.access_token);
      message.success('登录成功');
      navigate('/templates');
    } catch {
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-left">
          <div className="login-illustration" />
        </div>
        <div className="login-right">
          <div className="login-title">欢迎回来</div>
          <div className="login-subtitle">登录到 MailFlow 邮件调度系统</div>
          
          <Form
            name="login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="请输入用户名" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" size="large" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block className="login-btn" size="large">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
