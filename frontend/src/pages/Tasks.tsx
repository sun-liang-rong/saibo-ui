import React, { useCallback, useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Select, message, Popconfirm, Tag, Radio, TimePicker, DatePicker, InputNumber, Space, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import request from '../utils/request';

interface Task {
  id: number;
  schedule: string;
  status: string;
  created_at: string;
  last_executed_at: string;
  email_template: {
    id: number;
    subject: string;
    to_email: string;
  };
}

interface TemplateSummary {
  id: number;
  subject: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setPage(1);
  };
  const [total, setTotal] = useState<number>(0);
  
  const [cronType, setCronType] = useState<string>('daily');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await request.get('/tasks', { 
        params: { 
          page: page, 
          pageSize: pageSize,
          status: activeTab === 'pending' ? 'pending,running,paused' : activeTab 
        } 
      })) as PaginatedResponse<Task>;
      setTasks(res.data ?? []);
      setTotal(res.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, pageSize]);

  const fetchTemplates = useCallback(async () => {
    const res = (await request.get('/templates/all')) as TemplateSummary[];
    setTemplates(res);
  }, []);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (!isModalOpen) return;
    if (templates.length) return;
    void fetchTemplates();
  }, [fetchTemplates, isModalOpen, templates.length]);

  const generateCron = (values: { type?: string; time?: Dayjs; weekDay?: number; monthDay?: number; date?: Dayjs }) => {
    const { type, time, weekDay, monthDay, date } = values;
    const s = '0';
    
    if (type === 'once' && date) {
      const d = dayjs(date);
      return `${s} ${d.minute()} ${d.hour()} ${d.date()} ${d.month() + 1} *`;
    }
    
    if (time) {
      const t = dayjs(time);
      const m = t.minute();
      const h = t.hour();
      
      if (type === 'daily') return `${s} ${m} ${h} * * *`;
      if (type === 'weekly') return `${s} ${m} ${h} * * ${weekDay}`;
      if (type === 'monthly') return `${s} ${m} ${h} ${monthDay} * *`;
    }
    
    return '* * * * * *';
  };

  const parseCron = (cron: string) => {
    if (!cron) return { type: 'daily', time: dayjs() };
    
    const parts = cron.split(' ');
    const offset = parts.length === 6 ? 1 : 0;
    
    const minute = parseInt(parts[0 + offset]) || 0;
    const hour = parseInt(parts[1 + offset]) || 0;
    const dayOfMonth = parts[2 + offset];
    const month = parts[3 + offset];
    const dayOfWeek = parts[4 + offset];
    
    const time = dayjs().hour(hour).minute(minute);
    
    if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return { type: 'daily', time };
    }
    if (dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
      return { type: 'weekly', time, weekDay: parseInt(dayOfWeek) };
    }
    if (dayOfMonth !== '*' && month === '*' && dayOfWeek === '*') {
      return { type: 'monthly', time, monthDay: parseInt(dayOfMonth) };
    }
    if (dayOfMonth !== '*' && month !== '*') {
      const date = dayjs().month(parseInt(month) - 1).date(parseInt(dayOfMonth)).hour(hour).minute(minute);
      return { type: 'once', date };
    }
    
    return { type: 'daily', time };
  };

  const formatCronToText = (cron: string) => {
    if (!cron) return '-';
    
    const parts = cron.split(' ');
    const offset = parts.length === 6 ? 1 : 0;
    
    const minute = parseInt(parts[0 + offset]) || 0;
    const hour = parseInt(parts[1 + offset]) || 0;
    const dayOfMonth = parts[2 + offset];
    const month = parts[3 + offset];
    const dayOfWeek = parts[4 + offset];
    
    const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
    if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return `每天 ${timeStr}`;
    }
    
    if (dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
      const weekMap: { [key: number]: string } = { 0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' };
      return `每周${weekMap[parseInt(dayOfWeek)]} ${timeStr}`;
    }
    
    if (dayOfMonth !== '*' && month === '*' && dayOfWeek === '*') {
      return `每月${parseInt(dayOfMonth)}日 ${timeStr}`;
    }
    
    if (dayOfMonth !== '*' && month !== '*') {
      const date = dayjs().month(parseInt(month) - 1).date(parseInt(dayOfMonth)).hour(hour).minute(minute);
      return `单次 ${date.format('YYYY-MM-DD HH:mm')}`;
    }
    
    return cron;
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const schedule = generateCron(values);
      
      const payload = {
        email_template_id: values.email_template_id,
        schedule,
      };

      if (editingId) {
        await request.put(`/tasks/${editingId}`, payload);
        message.success('更新成功');
      } else {
        await request.post('/tasks', payload);
        message.success('创建成功');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchTasks();
    } catch {
      // handled
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/tasks/${id}`);
      message.success('删除成功');
      fetchTasks();
    } catch {
      // handled
    }
  };

  const handleStart = async (id: number) => {
    try {
      await request.post(`/tasks/${id}/start`);
      message.success('任务已启动');
      fetchTasks();
    } catch {
      // handled
    }
  };

  const handlePause = async (id: number) => {
    try {
      await request.post(`/tasks/${id}/pause`);
      message.success('任务已暂停');
      fetchTasks();
    } catch {
      // handled
    }
  };

  const openEdit = (record: Task) => {
    setEditingId(record.id);
    const formValues = parseCron(record.schedule);
    setCronType(formValues.type);
    form.setFieldsValue({
      email_template_id: record.email_template?.id,
      ...formValues,
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    form.resetFields();
    setCronType('daily');
    form.setFieldsValue({ type: 'daily', time: dayjs() });
    setIsModalOpen(true);
  };

  const pendingColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: '模板',
      key: 'template',
      render: (_: unknown, record: Task) => record.email_template?.subject || '未知模板',
    },
    {
      title: '收件人',
      key: 'to_email',
      render: (_: unknown, record: Task) => record.email_template?.to_email || '-',
    },
    {
      title: '执行频率',
      key: 'schedule',
      render: (_: unknown, record: Task) => formatCronToText(record.schedule),
    },
    {
      title: 'Cron表达式',
      dataIndex: 'schedule',
      key: 'schedule_raw',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'running') color = 'success';
        if (status === 'paused') color = 'warning';
        if (status === 'failed') color = 'error';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
    {
      title: '上次执行时间',
      dataIndex: 'last_executed_at',
      key: 'last_executed_at',
      render: (date: string) => date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Task) => (
        <>
          {record.status !== 'running' && (
            <Button icon={<PlayCircleOutlined />} type="link" onClick={() => handleStart(record.id)}>启动</Button>
          )}
          {record.status === 'running' && (
            <Button icon={<PauseCircleOutlined />} type="link" onClick={() => handlePause(record.id)}>暂停</Button>
          )}
          <Button icon={<EditOutlined />} type="link" onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} type="link" danger>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const completedColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: '模板',
      key: 'template',
      render: (_: unknown, record: Task) => record.email_template?.subject || '未知模板',
    },
    {
      title: '收件人',
      key: 'to_email',
      render: (_: unknown, record: Task) => record.email_template?.to_email || '-',
    },
    {
      title: '执行频率',
      key: 'schedule',
      render: (_: unknown, record: Task) => formatCronToText(record.schedule),
    },
    {
      title: 'Cron表达式',
      dataIndex: 'schedule',
      key: 'schedule_raw',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'completed') color = 'success';
        if (status === 'failed') color = 'error';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
    {
      title: '上次执行时间',
      dataIndex: 'last_executed_at',
      key: 'last_executed_at',
      render: (date: string) => date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Task) => (
        <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
          <Button icon={<DeleteOutlined />} type="link" danger>删除</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        items={[
          {
            key: 'pending',
            label: '待执行',
            children: (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                  >
                    新建任务
                  </Button>
                </div>
                <Table 
                  rowKey="id" 
                  columns={pendingColumns} 
                  dataSource={tasks} 
                  loading={loading} 
                  pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: total,
                    onChange: (p, ps) => {
                      setPage(p);
                      setPageSize(ps || 10);
                    },
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (t) => `共 ${t} 条`,
                  }}
                />
              </>
            ),
          },
          {
            key: 'completed',
            label: '已执行',
            children: (
              <Table 
                rowKey="id" 
                columns={completedColumns} 
                dataSource={tasks} 
                loading={loading} 
                pagination={{
                  current: page,
                  pageSize: pageSize,
                  total: total,
                  onChange: (p, ps) => {
                    setPage(p);
                    setPageSize(ps || 10);
                  },
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条`,
                }}
              />
            ),
          },
        ]}
      />

      <Modal
        title={editingId ? '编辑任务' : '新建任务'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form 
            form={form} 
            layout="vertical"
            onValuesChange={(changedValues) => {
                if (changedValues.type) setCronType(changedValues.type);
            }}
        >
          <Form.Item
            name="email_template_id"
            label="选择模板"
            rules={[{ required: true, message: '请选择模板' }]}
          >
            <Select>
              {templates.map((t) => (
                <Select.Option key={t.id} value={t.id}>
                  {t.subject}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="type" label="执行频率" initialValue="daily">
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="once">单次</Radio.Button>
              <Radio.Button value="daily">每天</Radio.Button>
              <Radio.Button value="weekly">每周</Radio.Button>
              <Radio.Button value="monthly">每月</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {cronType === 'once' && (
            <Form.Item 
                name="date" 
                label="执行时间" 
                rules={[{ required: true, message: '请选择时间' }]}
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          )}

          {cronType !== 'once' && (
            <Space align="baseline">
               <Form.Item 
                    name="time" 
                    label="时间" 
                    rules={[{ required: true, message: '请选择时间' }]}
               >
                 <TimePicker format="HH:mm" />
               </Form.Item>

               {cronType === 'weekly' && (
                 <Form.Item 
                    name="weekDay" 
                    label="星期" 
                    initialValue={1}
                    rules={[{ required: true }]}
                 >
                   <Select style={{ width: 100 }}>
                     <Select.Option value={1}>周一</Select.Option>
                     <Select.Option value={2}>周二</Select.Option>
                     <Select.Option value={3}>周三</Select.Option>
                     <Select.Option value={4}>周四</Select.Option>
                     <Select.Option value={5}>周五</Select.Option>
                     <Select.Option value={6}>周六</Select.Option>
                     <Select.Option value={0}>周日</Select.Option>
                   </Select>
                 </Form.Item>
               )}

               {cronType === 'monthly' && (
                 <Form.Item 
                    name="monthDay" 
                    label="日期" 
                    initialValue={1}
                    rules={[{ required: true }]}
                 >
                   <InputNumber min={1} max={31} />
                 </Form.Item>
               )}
            </Space>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Tasks;
