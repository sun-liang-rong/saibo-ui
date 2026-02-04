import React, { useCallback, useEffect, useState } from 'react';
import { Table, Tabs, Tag, Button, Space, Typography, Popconfirm, Tooltip } from 'antd';
import { PlusOutlined, PlayCircleOutlined, PauseCircleOutlined, DeleteOutlined, ReloadOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import request from '../utils/request';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

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
  is_rule: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [queryStatus, setQueryStatus] = useState(['PENDING', 'RUNNING', 'PAUSED'])
  const fetchTemplates = useCallback(async () => {
    if (templates.length) return;
    const templateRes = (await request.get('/templates/all')) as Template[];
    setTemplates(templateRes);
  }, [templates.length]);

  const fetchTasks = useCallback(async (currentPage?: number, currentPageSize?: number) => {
    setLoading(true);
    try {
      const p = currentPage ?? page;
      const ps = currentPageSize ?? pageSize;
      const res = (await request.get('/tasks', { params: { page: p, pageSize: ps, status: queryStatus.join(',') } })) as PaginatedResponse<Task>;
      setTasks(res.data ?? []);
      setTotal(res.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, activeTab]);

  useEffect(() => {
    void fetchTemplates();
    void fetchTasks();
  }, [fetchTasks, fetchTemplates]);

  const handlePause = async (id: number) => {
    try {
      await request.patch(`/tasks/${id}`, { status: 'PAUSED' });
      void fetchTasks();
    } catch {}
  };

  const handleResume = async (id: number) => {
    try {
      await request.patch(`/tasks/${id}`, { status: 'PENDING' });
      void fetchTasks();
    } catch {}
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/tasks/${id}`);
      void fetchTasks();
    } catch {}
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING: { color: 'default', icon: <ClockCircleOutlined />, text: '待执行' },
      RUNNING: { color: 'processing', icon: <PlayCircleOutlined />, text: '运行中' },
      COMPLETED: { color: 'success', icon: <ReloadOutlined />, text: '已完成' },
      FAILED: { color: 'error', icon: <DeleteOutlined />, text: '失败' },
      PAUSED: { color: 'warning', icon: <PauseCircleOutlined />, text: '暂停' },
    };
    return configs[status] || { color: 'default', icon: null, text: status };
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '模板',
      key: 'template',
      ellipsis: true,
      render: (_: unknown, record: Task) => {
        const title = templates.find((item) => item.id === record.email_template_id)?.subject || '-';
        return title;
      },
    },
    {
      title: '调度时间',
      dataIndex: 'schedule',
      key: 'schedule',
      render: (schedule: string) => (
        <Space size={4}>
          <CalendarOutlined style={{ color: '#94a3b8' }} />
          <Text>{schedule}</Text>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const { color, icon, text } = getStatusConfig(status);
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (text: string) => new Date(text).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right' as const,
      render: (_: unknown, record: Task) => (
        <Space size="small">
          {record.status === 'PAUSED' ? (
            <Tooltip title="恢复任务">
              <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => handleResume(record.id)}>
                恢复
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="暂停任务">
              <Button type="link" size="small" icon={<PauseCircleOutlined />} onClick={() => handlePause(record.id)}>
                暂停
              </Button>
            </Tooltip>
          )}
          <Popconfirm title="确认删除此任务吗？" onConfirm={() => handleDelete(record.id)} okText="确认" cancelText="取消">
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const pendingTasks = tasks.filter((task) => ['PENDING', 'RUNNING', 'PAUSED'].includes(task.status));
  const completedTasks = tasks.filter((task) => ['COMPLETED', 'FAILED'].includes(task.status));
  const currentTasks = tasks;

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            <CalendarOutlined style={{ fontSize: 24, color: '#fff' }} />
          </div>
          <div>
            <Title level={3} style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
              任务管理
            </Title>
            <Text type="secondary">创建和管理邮件调度任务</Text>
          </div>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            border: 'none',
            height: 40,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          创建任务
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(val) => {
          setActiveTab(val)
          setQueryStatus(val === 'pending' ? ['PENDING', 'RUNNING', 'PAUSED'] : ['COMPLETED', 'FAILED'])
        }}
        items={[
          {
            key: 'pending',
            label: (
              <span>
                <ClockCircleOutlined />
                进行中
              </span>
            ),
          },
          {
            key: 'completed',
            label: (
              <span>
                <ReloadOutlined />
                已完成
              </span>
            ),
          },
        ]}
        style={{ marginBottom: 16 }}
      />

      <Table
        rowKey="id"
        columns={columns}
        dataSource={currentTasks}
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps || 10);
            fetchTasks(p, ps || 10);
          },
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (t) => `共 ${t} 条任务`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default Tasks;
