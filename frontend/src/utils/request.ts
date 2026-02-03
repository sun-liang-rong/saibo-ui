import axios from 'axios';
import { message } from 'antd';

let activeRequests = 0;

const showGlobalLoading = () => {
  activeRequests++;
  if (activeRequests === 1) {
    window.dispatchEvent(new CustomEvent('show-loading'));
  }
};

const hideGlobalLoading = () => {
  activeRequests--;
  if (activeRequests === 0) {
    window.dispatchEvent(new CustomEvent('hide-loading'));
  }
};

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    showGlobalLoading();
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    hideGlobalLoading();
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    hideGlobalLoading();
    return response.data;
  },
  (error) => {
    hideGlobalLoading();
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
