import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, tokenStorage } from '../services/authService';

/**
 * 认证上下文
 *
 * 用于管理全局的登录状态和用户信息
 * 提供登录、退出登录等功能
 */

const AuthContext = createContext(null);

/**
 * 认证上下文 Provider
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子组件
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * 初始化：从 localStorage 恢复登录状态
   */
  useEffect(() => {
    const token = tokenStorage.getToken();
    const savedUser = tokenStorage.getUser();

    if (token && savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  /**
   * 登录
   *
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise} 登录结果
   */
  const login = async (username, password) => {
    try {
      const response = await loginApi({ username, password });

      // 保存 token 和用户信息
      tokenStorage.setToken(response.access_token);
      tokenStorage.setUser(response.user);

      // 更新状态
      setUser(response.user);
      setIsAuthenticated(true);

      return { success: true, user: response.user };
    } catch (error) {
      console.error('登录失败:', error);
      return {
        success: false,
        message: error.response?.data?.message || '登录失败，请检查用户名和密码',
      };
    }
  };

  /**
   * 退出登录
   */
  const logout = () => {
    // 清除 localStorage
    tokenStorage.clear();

    // 清除状态
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * 更新用户信息
   *
   * @param {Object} newUser - 新的用户信息
   */
  const updateUser = (newUser) => {
    setUser(newUser);
    tokenStorage.setUser(newUser);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * 使用认证上下文的 Hook
 *
 * @returns {Object} 认证上下文值
 *
 * 使用示例：
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
