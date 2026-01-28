import api from './api';

/**
 * 邮件服务 API
 *
 * 封装所有与邮件任务相关的接口调用
 * 包括：创建、查询、删除等操作
 *
 * 为什么单独封装服务层：
 * 1. 统一管理 API 接口
 * 2. 便于维护和修改
 * 3. 可以添加额外的业务逻辑
 * 4. 便于测试和 Mock
 */

/**
 * 邮件状态枚举
 */
export const EmailStatus = {
  PENDING: 'pending', // 待发送
  SENT: 'sent', // 已发送
  FAILED: 'failed', // 失败
  RETRYING: 'retrying', // 重试中
};
// 获取邮件总计
export const getEmailTotal = async () => {
  return await api.get('/health/stats');
};
/**
 * 创建定时邮件任务
 *
 * @param {Object} data - 邮件数据
 * @param {string} data.to_email - 收件人邮箱
 * @param {string} data.subject - 邮件标题
 * @param {string} data.content - 邮件内容（HTML 或文本）
 * @param {string} data.send_time - 发送时间（ISO 8601 格式）
 * @returns {Promise} 返回创建的邮件任务数据
 *
 * 接口：POST /emails
 */
export const createEmailTask = async (data) => {
  return await api.post('/emails', data);
};

/**
 * 更新定时邮件任务
 *
 * @param {number} id - 邮件任务 ID
 * @param {Object} data - 邮件数据
 * @param {string} data.to_email - 收件人邮箱
 * @param {string} data.subject - 邮件标题
 * @param {string} data.content - 邮件内容（HTML 或文本）
 * @param {string} data.send_time - 发送时间（ISO 8601 格式）
 * @returns {Promise} 返回更新后的邮件任务数据
 *
 * 接口：PUT /emails/:id
 *
 * 注意：只能更新待发送状态的邮件
 */
export const updateEmailTask = async (id, data) => {
  return await api.put(`/emails/${id}`, data);
};

/**
 * 获取邮件任务列表
 *
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码（默认 1）
 * @param {number} params.limit - 每页数量（默认 10）
 * @param {string} params.status - 状态筛选（可选）
 * @returns {Promise} 返回邮件任务列表
 *
 * 接口：GET /emails?page=1&limit=10&status=pending
 */
export const getEmailTasks = async (params = {}) => {
  const { page = 1, limit = 10, status, search } = params;
  return await api.get('/emails', {
    params: {
      page,
      limit,
      status,
      search
    },
  });
};

/**
 * 获取单个邮件任务详情
 *
 * @param {number} id - 邮件任务 ID
 * @returns {Promise} 返回邮件任务详情
 *
 * 接口：GET /emails/:id
 */
export const getEmailTaskById = async (id) => {
  return await api.get(`/emails/${id}`);
};

/**
 * 删除邮件任务
 *
 * @param {number} id - 邮件任务 ID
 * @returns {Promise} 返回删除结果
 *
 * 接口：DELETE /emails/:id
 *
 * 注意：只能删除待发送或已失败的邮件，已发送的邮件不能删除
 */
export const deleteEmailTask = async (id) => {
  return await api.delete(`/emails/${id}`);
};

/**
 * 获取健康检查信息
 *
 * @returns {Promise} 返回系统状态
 *
 * 接口：GET /health
 */
export const getHealthCheck = async () => {
  return await api.get('/health');
};

/**
 * 获取邮件任务统计信息
 *
 * @returns {Promise} 返回统计数据
 *
 * 接口：GET /health/stats
 */
export const getEmailStats = async () => {
  return await api.get('/health/stats');
};

/**
 * 格式化邮件状态为中文
 *
 * @param {string} status - 邮件状态
 * @returns {string} 中文状态文本
 */
export const formatEmailStatus = (status) => {
  const statusMap = {
    [EmailStatus.PENDING]: '待发送',
    [EmailStatus.SENT]: '已发送',
    [EmailStatus.FAILED]: '发送失败',
    [EmailStatus.RETRYING]: '重试中',
  };
  return statusMap[status] || status;
};

/**
 * 获取邮件状态对应的颜色
 *
 * @param {string} status - 邮件状态
 * @returns {string} Ant Design Tag 颜色
 */
export const getStatusColor = (status) => {
  const colorMap = {
    [EmailStatus.PENDING]: 'blue',
    [EmailStatus.SENT]: 'green',
    [EmailStatus.FAILED]: 'red',
    [EmailStatus.RETRYING]: 'orange',
  };
  return colorMap[status] || 'default';
};
