import React, { useCallback, useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm, Tooltip, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, ClockCircleOutlined, MailOutlined } from '@ant-design/icons';
import request from '../utils/request';
import { TableSkeleton } from '../components/SkeletonLoader';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Template {
  id: number;
  subject: string;
  body: string;
  to_email: string;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const fetchTemplates = useCallback(async (currentPage?: number, currentPageSize?: number) => {
    setLoading(true);
    try {
      const p = currentPage ?? page;
      const ps = currentPageSize ?? pageSize;
      const res = (await request.get('/templates', { params: { page: p, pageSize: ps } })) as PaginatedResponse<Template>;
      setTemplates(res.data ?? []);
      setTotal(res.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    void fetchTemplates();
  }, [fetchTemplates]);

  const handleAdd = () => {
    setEditingTemplate(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    form.setFieldsValue(template);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/templates/${id}`);
      message.success('删除成功');
      void fetchTemplates();
    } catch {}
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingTemplate) {
        await request.put(`/templates/${editingTemplate.id}`, values);
        message.success('更新成功');
      } else {
        await request.post('/templates', values);
        message.success('创建成功');
      }
      setIsModalVisible(false);
      void fetchTemplates();
    } catch {}
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '邮件主题',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
      render: (subject: string) => (
        <Space size={8}>
          <MailOutlined style={{ color: '#6366f1' }} />
          <Text>{subject}</Text>
        </Space>
      ),
    },
    {
      title: '收件人',
      dataIndex: 'to_email',
      key: 'to_email',
      ellipsis: true,
      render: (email: string) => (
        <Text ellipsis={{ tooltip: email }}>{email}</Text>
      ),
    },
    {
      title: '邮件内容',
      dataIndex: 'body',
      key: 'body',
      ellipsis: true,
      render: (body: string) => (
        <Text type="secondary" ellipsis={{ tooltip: body }}>
          {body}
        </Text>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (text: string) => (
        <Space size={4}>
          <ClockCircleOutlined style={{ color: '#94a3b8' }} />
          <Text>{new Date(text).toLocaleString('zh-CN')}</Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
      fixed: 'right' as const,
      render: (_: unknown, record: Template) => (
        <Space size="small">
          <Tooltip title="编辑模板">
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
              编辑
            </Button>
          </Tooltip>
          <Popconfirm title="确认删除此模板吗？" onConfirm={() => handleDelete(record.id)} okText="确认" cancelText="取消">
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
      {loading && templates.length === 0 ? (
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
            <FileTextOutlined style={{ fontSize: 24, color: '#fff' }} />
          </div>
          <div>
            <Title level={3} style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
              邮件模板
            </Title>
            <Text type="secondary">创建和管理邮件发送模板</Text>
          </div>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            border: 'none',
            height: 40,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          新建模板
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={templates}
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps || 10);
            fetchTemplates(p, ps || 10);
          },
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (t) => `共 ${t} 条模板`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editingTemplate ? '编辑模板' : '新建模板'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="subject"
            label="邮件主题"
            rules={[{ required: true, message: '请输入邮件主题' }]}
          >
            <Input placeholder="请输入邮件主题" />
          </Form.Item>

          <Form.Item
            name="to_email"
            label="收件人邮箱"
            rules={[{ required: true, message: '请输入收件人邮箱' }, { type: 'email', message: '请输入有效的邮箱地址' }]}
          >
            <Input placeholder="请输入收件人邮箱" />
          </Form.Item>

          <Form.Item
            name="body"
            label="邮件内容"
            rules={[{ required: true, message: '请输入邮件内容' }]}
          >
            <TextArea rows={8} placeholder="请输入邮件内容" />
          </Form.Item>
        </Form>
      </Modal>
        </>
      )}
    </div>
  );
};

export default Templates;
