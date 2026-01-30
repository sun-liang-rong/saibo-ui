import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: '/api', // Proxy will handle this or full URL
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        message.error(error.response.data.message || '请求失败');
      }
    } else {
      message.error('网络错误');
    }
    return Promise.reject(error);
  }
);

export default request;
