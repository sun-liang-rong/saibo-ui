import React, { useCallback, useEffect, useState } from 'react';
import { Table, Tag, Space, Typography } from 'antd';
import { HistoryOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import request from '../utils/request';

const { Title, Text } = Typography;

interface Template {
  id: number;
  subject: string;
  body: string;
  to_email: string;
  created_at: string;
  updated_at: string;
}

interface Task {
  id: number;
  user_id: number;
  email_template_id: number;
  schedule: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Log {
  id: number;
  task: Task;
  status: string;
  sent_at: string;
  error_msg: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

const History: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [template, setTemplates] = useState<Template[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const fetchTemplates = useCallback(async () => {
    if (template.length) return;
    const templateRes = (await request.get('/templates/all')) as Template[];
    setTemplates(templateRes);
  }, [template.length]);

  const fetchLogs = useCallback(async (currentPage?: number, currentPageSize?: number) => {
    setLoading(true);
    try {
      const p = currentPage ?? page;
      const ps = currentPageSize ?? pageSize;
      const res = (await request.get('/logs', { params: { page: p, pageSize: ps } })) as PaginatedResponse<Log>;
      setLogs(res.data ?? []);
      setTotal(res.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    void fetchTemplates();
    void fetchLogs();
  }, [fetchLogs, fetchTemplates]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '任务ID',
      key: 'taskId',
      width: 100,
      render: (_: unknown, record: Log) => record.task?.id,
    },
    {
      title: '模板',
      key: 'template',
      ellipsis: true,
      render: (_: unknown, record: Log) => {
        const title = template.find((item) => item.id === record.task?.email_template_id)?.subject || '-';
        return title;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const config = {
          success: { color: 'success', icon: <CheckCircleOutlined />, text: '成功' },
          failed: { color: 'error', icon: <CloseCircleOutlined />, text: '失败' },
        } as Record<string, { color: string; icon: React.ReactNode; text: string }>;

        const { color, icon, text } = config[status] || { color: 'default', icon: null, text: status.toUpperCase() };
        
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: '发送时间',
      dataIndex: 'sent_at',
      key: 'sent_at',
      width: 180,
      render: (text: string) => (
        <Space size={4}>
          <ClockCircleOutlined style={{ color: '#94a3b8' }} />
          <Text>{new Date(text).toLocaleString('zh-CN')}</Text>
        </Space>
      ),
    },
    {
      title: '错误信息',
      dataIndex: 'error_msg',
      key: 'error_msg',
      ellipsis: true,
      render: (text: string) => (
        <Text type="secondary" ellipsis={{ tooltip: text }}>
          {text || '-'}
        </Text>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Space align="center" size={12}>
          <div
            style={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HistoryOutlined style={{ fontSize: 24, color: '#fff' }} />
          </div>
          <div>
            <Title level={3} style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
              执行历史
            </Title>
            <Text type="secondary">查看邮件发送记录和执行状态</Text>
          </div>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={logs}
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps || 10);
            fetchLogs(p, ps || 10);
          },
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (t) => `共 ${t} 条记录`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        style={{
          backgroundColor: '#fff',
        }}
      />
    </div>
  );
};

export default History;
