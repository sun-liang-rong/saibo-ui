import React, { useCallback, useEffect, useState } from 'react';
import { Table, Tabs, Tag, Button, Space, Typography, Popconfirm, Tooltip, Modal, Form, Select, message, DatePicker, TimePicker, Radio } from 'antd';
import { PlusOutlined, PlayCircleOutlined, PauseCircleOutlined, DeleteOutlined, ReloadOutlined, CalendarOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import request from '../utils/request';
import { TableSkeleton } from '../components/SkeletonLoader';
import dayjs from 'dayjs';
import { generateCronExpression, parseCronExpression } from '../utils/cronGenerator';
import type { RepeatType, CronConfig } from '../utils/cronGenerator';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [repeatType, setRepeatType] = useState<RepeatType>('once');
  const [form] = Form.useForm();
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
      await request.post(`/tasks/${id}/pause`);
      void fetchTasks();
    } catch { }
  };

  const handleResume = async (id: number) => {
    try {
      await request.post(`/tasks/${id}/start`);
      void fetchTasks();
    } catch { }
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/tasks/${id}`);
      void fetchTasks();
    } catch { }
  };

  const handleAddTask = () => {
    form.resetFields();
    setRepeatType('once');
    setIsEditMode(false);
    setEditingTaskId(null);
    setIsModalVisible(true);
  };

  const handleEdit = (task: Task) => {
    const parsed = parseCronExpression(task.schedule) as CronConfig;
    setRepeatType(parsed.repeatType);

    const formValues: any = {
      email_template_id: task.email_template_id,
      time: parsed.time ? dayjs(parsed.time, 'HH:mm') : dayjs('09:00', 'HH:mm'),
    };

    if (parsed.repeatType === 'once' && parsed.date) {
      formValues.date = dayjs(parsed.date);
    }
    if (parsed.repeatType === 'weekly') {
      formValues.weekday = parsed.weekday;
    }
    if (parsed.repeatType === 'monthly') {
      formValues.dayOfMonth = parsed.dayOfMonth;
    }

    form.setFieldsValue(formValues);
    setIsEditMode(true);
    setEditingTaskId(task.id);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const cronExpression = generateCronExpression({
        repeatType,
        date: values.date ? values.date.toDate() : undefined,
        time: values.time ? values.time.format('HH:mm') : undefined,
        weekday: values.weekday,
        dayOfMonth: values.dayOfMonth,
      });

      if (isEditMode && editingTaskId) {
        await request.put(`/tasks/${editingTaskId}`, {
          email_template_id: values.email_template_id,
          schedule: cronExpression,
        });
        message.success('更新成功');
      } else {
        await request.post('/tasks', {
          email_template_id: values.email_template_id,
          schedule: cronExpression,
        });
        message.success('创建成功');
      }
      setIsModalVisible(false);
      void fetchTasks();
    } catch { }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setIsEditMode(false);
    setEditingTaskId(null);
    form.resetFields();
  };

  const getStatusConfig = (status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PAUSED') => {
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
          <Typography.Text>{schedule}</Typography.Text>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PAUSED') => {
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
      width: 280,
      fixed: 'right' as const,
      render: (_: unknown, record: Task) => (
        <Space size="small">
          {record.status === "completed" ? null : (
            <Tooltip title="编辑任务">
              <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                编辑
              </Button>
            </Tooltip>)
          }
          {record.status === 'paused' || record.status === 'pending' ? (
            <Tooltip title="恢复任务">
              <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => handleResume(record.id)}>
                启动
              </Button>
            </Tooltip>
          ) : null}
          {
            record.status === 'running' ? (
              <Tooltip title="暂停任务">
                <Button type="link" size="small" icon={<PauseCircleOutlined />} onClick={() => handlePause(record.id)}>
                  暂停
                </Button>
              </Tooltip>
            ) : null
          }
          <Popconfirm title="确认删除此任务吗？" onConfirm={() => handleDelete(record.id)} okText="确认" cancelText="取消">
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="fade-in">
      {loading && tasks.length === 0 ? (
        <TableSkeleton />
      ) : (
        <>
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
                <Typography.Title level={3} style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
                  任务管理
                </Typography.Title>
                <Typography.Text type="secondary">创建和管理邮件调度任务</Typography.Text>
              </div>
            </Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddTask}
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
            dataSource={tasks}
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

          <Modal
            title={isEditMode ? '编辑定时任务' : '创建定时任务'}
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            okText={isEditMode ? '保存' : '创建'}
            cancelText="取消"
            width={600}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="email_template_id"
                label="选择模板"
                rules={[{ required: true, message: '请选择邮件模板' }]}
              >
                <Select
                  placeholder="请选择邮件模板"
                  showSearch
                  optionFilterProp="children"
                >
                  {templates.map((template) => (
                    <Select.Option key={template.id} value={template.id}>
                      {template.subject}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="重复类型">
                <Radio.Group value={repeatType} onChange={(e) => setRepeatType(e.target.value)}>
                  <Radio.Button value="once">单次</Radio.Button>
                  <Radio.Button value="daily">每天</Radio.Button>
                  <Radio.Button value="weekly">每周</Radio.Button>
                  <Radio.Button value="monthly">每月</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="time"
                label="执行时间"
                rules={[{ required: true, message: '请选择执行时间' }]}
                initialValue={dayjs('09:00', 'HH:mm')}
              >
                <TimePicker
                  format="HH:mm"
                  placeholder="请选择时间"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              {repeatType === 'once' && (
                <Form.Item
                  name="date"
                  label="执行日期"
                  rules={[{ required: true, message: '请选择执行日期' }]}
                >
                  <DatePicker
                    placeholder="请选择日期"
                    style={{ width: '100%' }}
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                  />
                </Form.Item>
              )}

              {repeatType === 'weekly' && (
                <Form.Item
                  name="weekday"
                  label="星期"
                  rules={[{ required: true, message: '请选择星期' }]}
                  initialValue={1}
                >
                  <Select placeholder="请选择星期">
                    <Select.Option value={1}>星期一</Select.Option>
                    <Select.Option value={2}>星期二</Select.Option>
                    <Select.Option value={3}>星期三</Select.Option>
                    <Select.Option value={4}>星期四</Select.Option>
                    <Select.Option value={5}>星期五</Select.Option>
                    <Select.Option value={6}>星期六</Select.Option>
                    <Select.Option value={0}>星期日</Select.Option>
                  </Select>
                </Form.Item>
              )}

              {repeatType === 'monthly' && (
                <Form.Item
                  name="dayOfMonth"
                  label="每月几号"
                  rules={[{ required: true, message: '请选择日期' }]}
                  initialValue={1}
                >
                  <Select placeholder="请选择日期">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <Select.Option key={day} value={day}>
                        {day}日
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Tasks;
