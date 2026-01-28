import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  message,
  Tooltip,
  Card,
  Row,
  Col,
  Input,
  Select,
  Empty,
  Badge,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  CalendarOutlined,
  SearchOutlined,
  FilterOutlined,
  CheckOutlined,
  CloseOutlined,
  MailOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  getEmailTasks,
  deleteEmailTask,
  formatEmailStatus,
  getStatusColor,
  EmailStatus,
  getEmailTotal,
} from '../services/emailService';
import EmailTaskForm from './EmailTaskForm';
import EmailDetailModal from './EmailDetailModal';

// 频率文本映射
const frequencyText = {
  once: '单次',
  hourly: '每小时',
  daily: '每天',
  weekly: '每周',
  anniversary: '纪念日',
};

// 频率颜色映射
const frequencyColor = {
  once: 'default',
  hourly: 'cyan',
  daily: 'blue',
  weekly: 'green',
  anniversary: 'purple',
};

// 星期文本映射
const weekDayText = {
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
  7: '周日',
};

/**
 * 邮件任务列表组件 - 专业版
 *
 * 功能：
 * 1. 展示所有邮件任务（分页）
 * 2. 支持按状态筛选、关键词搜索
 * 3. 支持编辑、删除操作
 * 4. 实时刷新任务列表
 * 5. 显示任务统计信息
 * 6. 批量操作
 */
const EmailTaskList = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [emailTotal, setEmailTotal] = useState({
    total: 0,
    pending: 0,
    sent: 0,
    failed: 0,
    retrying: 0,
  });
  const [filters, setFilters] = useState({
    status: undefined,
    frequency: undefined,
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  // 表格选择
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 模态框状态
  const [formVisible, setFormVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);

  // 使用 useRef 来跟踪最新的请求，避免竞态条件
  const requestIdRef = useRef(0);

  /**
   * 加载邮件任务列表
   */
  const loadEmails = async (page = pagination.current, pageSize = pagination.pageSize) => {
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    try {
      console.log(searchKeyword, 'searchKeyword')
      const response = await getEmailTasks({
        page,
        limit: pageSize,
        status: filters.status,
        search: searchKeyword || undefined,
      });

      // 只有当这是最新的请求时才更新状态
      if (currentRequestId === requestIdRef.current) {
        setEmails(response.data);
        setPagination({
          current: page,
          pageSize,
          total: response.total,
        });
      }

      setLoading(false);
    } catch (error) {
      // 只有当这是最新的请求时才显示错误
      if (currentRequestId === requestIdRef.current) {
        console.error('加载邮件任务失败:', error);
        message.error('加载邮件任务失败，请稍后重试');
      }
      setLoading(false);
    }
  };

  /**
   * 获取邮件总计
   */
  const loadEmailTotal = async () => {
    try {
      const response = await getEmailTotal();
      setEmailTotal(response);
    } catch (error) {
      console.error('加载邮件统计失败:', error);
    }
  };

  /**
   * 初始加载和筛选条件变化时加载
   */
  useEffect(() => {
    loadEmails(pagination.current, pagination.pageSize);
    loadEmailTotal();
  }, [filters, searchKeyword]);

  /**
   * 设置定时刷新（每 30 秒）
   * 使用当前的分页状态刷新数据
   */
  useEffect(() => {
    const interval = setInterval(() => {
      loadEmails(pagination.current, pagination.pageSize);
      loadEmailTotal();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  /**
   * 处理表格变化（分页、筛选等）
   */
  const handleTableChange = (newPagination, newFilters) => {
    const statusFilter = newFilters.status ? newFilters.status[0] : undefined;

    // 只有当筛选条件真正改变时才更新 filters
    if (statusFilter !== filters.status) {
      setFilters((prev) => ({ ...prev, status: statusFilter }));
      // 筛选条件变化时，重置到第一页
      loadEmails(1, newPagination.pageSize);
    } else {
      // 只是分页变化，使用新的页码
      loadEmails(newPagination.current, newPagination.pageSize);
    }
  };

  /**
   * 删除邮件任务
   */
  const handleDelete = async (id) => {
    try {
      await deleteEmailTask(id);
      message.success('邮件任务删除成功');
      loadEmails();
      loadEmailTotal();
    } catch (error) {
      console.error('删除邮件任务失败:', error);
      message.error(error.response?.data?.message || '删除失败，请稍后重试');
    }
  };

  /**
   * 批量删除
   */
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一项');
      return;
    }

    try {
      for (const id of selectedRowKeys) {
        await deleteEmailTask(id);
      }
      message.success(`成功删除 ${selectedRowKeys.length} 个任务`);
      setSelectedRowKeys([]);
      loadEmails();
      loadEmailTotal();
    } catch (error) {
      console.error('批量删除失败:', error);
      message.error('批量删除失败，请稍后重试');
    }
  };

  /**
   * 编辑邮件任务
   */
  const handleEdit = (record) => {
    setEditData(record);
    setFormVisible(true);
  };

  /**
   * 查看邮件详情
   */
  const handleView = (record) => {
    setDetailData(record);
    setDetailVisible(true);
  };

  /**
   * 打开创建表单
   */
  const handleCreate = () => {
    setEditData(null);
    setFormVisible(true);
  };

  /**
   * 表单提交成功回调
   */
  const handleFormSuccess = () => {
    setFormVisible(false);
    loadEmails();
    loadEmailTotal();
  };


  /**
   * 表格列配置
   */
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '收件人',
      dataIndex: 'to_email',
      key: 'to_email',
      width: 200,
      ellipsis: true,
    },
    {
      title: '标题',
      dataIndex: 'subject',
      key: 'subject',
      width: 220,
      ellipsis: true,
    },
    {
      title: '调度频率',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 140,
      render: (frequency, record) => {
        const text = frequencyText[frequency] || frequency;
        const color = frequencyColor[frequency] || 'default';
        let fullText = text;

        if (frequency === 'weekly' && record.week_day) {
          fullText = `${text} ${weekDayText[record.week_day]}`;
        }

        if (frequency === 'anniversary' && record.anniversary_month && record.anniversary_day) {
          fullText = `${text} ${record.anniversary_month}月${record.anniversary_day}日`;
        }

        if (record.parent_id) {
          fullText += ' (子)';
        }

        return (
          <Tag icon={<CalendarOutlined />} color={color}>
            {fullText}
          </Tag>
        );
      },
    },
    {
      title: '发送时间',
      dataIndex: 'send_time',
      key: 'send_time',
      width: 180,
      render: (text) => {
        return <span>{dayjs(text).format('YYYY-MM-DD HH:mm')}</span>;
      },
      sorter: (a, b) => dayjs(a.send_time).unix() - dayjs(b.send_time).unix(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: '待发送', value: EmailStatus.PENDING },
        { text: '已发送', value: EmailStatus.SENT },
        { text: '发送失败', value: EmailStatus.FAILED },
        { text: '重试中', value: EmailStatus.RETRYING },
      ],
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {formatEmailStatus(status)}
        </Tag>
      ),
    },
    {
      title: '重试次数',
      dataIndex: 'retry_count',
      key: 'retry_count',
      width: 100,
      render: (count) => (count > 0 ? <Tag color="orange">{count}</Tag> : '-'),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>

          {record.status === EmailStatus.PENDING && (
            <Tooltip title="编辑">
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
          )}

          {(record.status === EmailStatus.PENDING || record.status === EmailStatus.FAILED) && (
            <Popconfirm
              title="确定要删除这个邮件任务吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Tooltip title="删除">
                <Button
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>

      {/* 操作和筛选区 */}
      <Card
        bordered={false}
        style={{
          borderRadius: 8,
          marginBottom: 16,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        }}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <Space size="middle" wrap>
          {/* 搜索框 */}
          <Input
            placeholder="搜索标题、收件人..."
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => {
              console.log(e.target.value)
              setSearchKeyword(e.target.value)
            }}
            onPressEnter={() => loadEmails(1)}
            style={{ width: 280 }}
            allowClear
          />

          {/* 状态筛选 */}
          <Select
            placeholder="选择状态"
            value={filters.status}
            onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
            style={{ width: 140 }}
            allowClear
          >
            <Select.Option value={EmailStatus.PENDING}>待发送</Select.Option>
            <Select.Option value={EmailStatus.SENT}>已发送</Select.Option>
            <Select.Option value={EmailStatus.FAILED}>发送失败</Select.Option>
            <Select.Option value={EmailStatus.RETRYING}>重试中</Select.Option>
          </Select>

          {/* 操作按钮 */}
          <Space size="small">
            <Button icon={<ReloadOutlined />} onClick={() => loadEmails()}>
              刷新
            </Button>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title={`确定要删除选中的 ${selectedRowKeys.length} 个任务吗？`}
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button danger icon={<DeleteOutlined />}>
                  批量删除
                </Button>
              </Popconfirm>
            )}
            <Button type="primary" onClick={handleCreate}>
              创建新任务
            </Button>
          </Space>
        </Space>
      </Card>

      {/* 表格 */}
      <Card
        bordered={false}
        style={{
          borderRadius: 8,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={emails}
          rowKey="id"
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            getCheckboxProps: (record) => ({
              disabled: record.status !== EmailStatus.PENDING && record.status !== EmailStatus.FAILED,
            }),
          }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1400 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <div style={{ color: '#8c8c8c', marginBottom: 8 }}>暂无邮件任务</div>
                    <Button type="primary" size="small" onClick={handleCreate}>
                      创建第一个任务
                    </Button>
                  </div>
                }
              />
            ),
          }}
        />
      </Card>

      {/* 创建/编辑表单 */}
      <EmailTaskForm
        visible={formVisible}
        editData={editData}
        onCancel={() => setFormVisible(false)}
        onSuccess={handleFormSuccess}
      />

      {/* 详情模态框 */}
      <EmailDetailModal
        visible={detailVisible}
        data={detailData}
        onCancel={() => setDetailVisible(false)}
      />
    </div>
  );
};

export default EmailTaskList;
