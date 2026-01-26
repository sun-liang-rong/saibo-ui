import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  message,
  Tooltip,
  Card,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  CalendarOutlined,
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
  daily: '每天',
  weekly: '每周',
};

// 频率颜色映射
const frequencyColor = {
  once: 'default',
  daily: 'blue',
  weekly: 'green',
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
 * 邮件任务列表组件
 *
 * 功能：
 * 1. 展示所有邮件任务（分页）
 * 2. 支持按状态筛选
 * 3. 支持编辑、删除操作（仅限待发送状态）
 * 4. 实时刷新任务列表
 * 5. 显示任务统计信息
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
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    sent: 0,
    failed: 0,
    retrying: 0,
  });

  // 模态框状态
  const [formVisible, setFormVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);

  /**
   * 加载邮件任务列表
   */
  const loadEmails = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const response = await getEmailTasks({
        page,
        limit: pageSize,
        status: filters.status,
      });

      setEmails(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.total,
      });

      setLoading(false);
    } catch (error) {
      console.error('加载邮件任务失败:', error);
      message.error('加载邮件任务失败，请稍后重试');
      setLoading(false);
    }
  };
  /**
   * 获取邮件总计
   */
  const loadEmailTotal = async () => {
    try {
      const response = await getEmailTotal();
      console.log(response, 'response')
      setEmailTotal(response);
    } catch (error) {
      console.error('加载邮件任务失败:', error);
    }
  };

  /**
   * 加载统计信息
   */
  const loadStats = async () => {
    try {
      // TODO: 调用统计 API
      // const response = await getEmailStats();
      // setStats(response);
    } catch (error) {
      console.error('加载统计信息失败:', error);
    }
  };

  /**
   * 初始加载
   */
  useEffect(() => {
    loadEmails();
    loadStats();
    loadEmailTotal();

    // 设置定时刷新（每 30 秒）
    const interval = setInterval(() => {
      loadEmails();
      loadStats();
      loadEmailTotal();
    }, 30000);

    return () => clearInterval(interval);
  }, [filters]);

  /**
   * 处理表格变化（分页、筛选等）
   */
  const handleTableChange = (pagination, filters, sorter) => {
    const statusFilter = filters.status ? filters.status[0] : undefined;
    setFilters({ status: statusFilter });
    loadEmails(pagination.current, pagination.pageSize);
  };

  /**
   * 删除邮件任务
   */
  const handleDelete = async (id) => {
    try {
      await deleteEmailTask(id);
      message.success('邮件任务删除成功');
      loadEmails();
      loadStats();
    } catch (error) {
      console.error('删除邮件任务失败:', error);
      message.error(error.response?.data?.message || '删除失败，请稍后重试');
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
    loadStats();
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
      width: 200,
      ellipsis: true,
    },
    {
      title: '调度频率',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 120,
      render: (frequency, record) => {
        const text = frequencyText[frequency] || frequency;
        const color = frequencyColor[frequency] || 'default';
        let fullText = text;

        // 如果是每周任务，显示星期几
        if (frequency === 'weekly' && record.week_day) {
          fullText = `${text} ${weekDayText[record.week_day]}`;
        }

        // 如果是子任务，显示标记
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
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
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
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {/* 查看详情 */}
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>

          {/* 编辑（仅待发送状态可编辑） */}
          {record.status === EmailStatus.PENDING && (
            <Tooltip title="编辑">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
          )}

          {/* 删除（仅待发送和失败状态可删除） */}
          {(record.status === EmailStatus.PENDING || record.status === EmailStatus.FAILED) && (
            <Popconfirm
              title="确定要删除这个邮件任务吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Tooltip title="删除">
                <Button type="link" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 统计信息卡片 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="总计" value={emailTotal.total} />
          </Col>
          <Col span={6}>
            <Statistic
              title="待发送"
              value={emailTotal.pending}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="已发送"
              value={emailTotal.sent}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="失败"
              value={emailTotal.failed}
              valueStyle={{ color: '#f5222d' }}
            />
          </Col>
        </Row>
      </Card>

      {/* 操作栏 */}
      <Card
        title="邮件任务列表"
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => loadEmails()}
            >
              刷新
            </Button>
            <Button
              type="primary"
              onClick={handleCreate}
            >
              创建新任务
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={emails}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1500 }}
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
