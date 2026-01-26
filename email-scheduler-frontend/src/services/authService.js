import api from './api';

/**
 * 认证服务 API
 *
 * 封装所有与用户认证相关的接口调用
 * 包括：登录、注册、退出登录等
 */

/**
 * 用户登录
 *
 * @param {Object} data - 登录数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise} 返回登录结果（包含 token 和用户信息）
 *
 * 接口：POST /auth/login
 *
 * 响应数据：
 * {
 *   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "token_type": "Bearer",
 *   "expires_in": 3600,
 *   "user": {
 *     "id": 1,
 *     "username": "admin",
 *     "email": "admin@example.com"
 *   }
 * }
 */
export const login = async (data) => {
  return await api.post('/auth/login', data);
};

/**
 * 用户注册
 *
 * @param {Object} data - 注册数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.email - 邮箱（可选）
 * @returns {Promise} 返回注册结果
 *
 * 接口：POST /auth/register
 */
export const register = async (data) => {
  return await api.post('/auth/register', data);
};

/**
 * Token 存储管理
 *
 * 使用 localStorage 存储 JWT token
 */
export const tokenStorage = {
  /**
   * 保存 token
   * @param {string} token - JWT token
   */
  setToken(token) {
    localStorage.setItem('access_token', token);
  },

  /**
   * 获取 token
   * @returns {string|null} JWT token
   */
  getToken() {
    return localStorage.getItem('access_token');
  },

  /**
   * 保存用户信息
   * @param {Object} user - 用户信息
   */
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  /**
   * 获取用户信息
   * @returns {Object|null} 用户信息
   */
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * 清除所有认证信息
   */
  clear() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  /**
   * 检查是否已登录
   * @returns {boolean} 是否已登录
   */
  isAuthenticated() {
    return !!this.getToken();
  },
};
