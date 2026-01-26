import axios from 'axios';
import { tokenStorage } from './authService';

/**
 * Axios 实例配置
 *
 * 为什么使用 axios.create()：
 * 1. 统一配置基础 URL 和超时时间
 * 2. 自动添加请求拦截器和响应拦截器
 * 3. 便于扩展和修改配置
 * 4. 支持多个实例（如果有不同的后端服务）
 */
const api = axios.create({
  baseURL: '/api', // 使用代理，实际会转发到 http://localhost:3000
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器
 *
 * 在发送请求之前执行
 * 自动添加 JWT token 到请求头
 */
api.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = tokenStorage.getToken();

    // 如果 token 存在，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 *
 * 在收到响应之后执行
 * 统一处理错误和响应数据
 */
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error('请求参数错误:', data.message);
          break;
        case 401:
          // 未授权，清除 token 并跳转到登录页
          console.error('未授权，请重新登录');
          tokenStorage.clear();
          // 如果不在登录页，跳转到登录页
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('拒绝访问');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error('未知错误:', data.message);
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('网络错误，请检查网络连接');
    } else {
      // 其他错误
      console.error('请求失败:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
