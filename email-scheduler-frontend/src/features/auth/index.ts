/**
 * Auth Feature Module
 *
 * 认证功能模块
 */

// 导出auth相关组件
export { default as LoginPage } from '../../components/LoginPage';
export { default as ProtectedRoute } from '../../components/ProtectedRoute';
export { default as ProLayout } from '../../components/ProLayout';

// 导出Context
export { AuthProvider, useAuth } from '../../contexts/AuthContext';

// 导出API
export { default as authApi } from '../../services/authService';

// 导出类型
export type { UserInfo } from '../../types';
