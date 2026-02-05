import React, { useCallback, useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm, Tooltip, Modal, Form, Input, message, Switch, Divider, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, ClockCircleOutlined, MailOutlined, RobotOutlined, InfoCircleOutlined } from '@ant-design/icons';
import request from '../utils/request';
import { TableSkeleton } from '../components/SkeletonLoader';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Template {
  id: number;
  subject: string;
  body: string;
  to_email: string;
  prompt?: string;
  use_ai?: boolean;
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
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
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

  const handleGeneratePreview = async () => {
    try {
      const values = await form.validateFields();
      if (!values.prompt) {
        message.warning('请先输入 AI 提示词');
        return;
      }

      setPreviewLoading(true);
      const response = await request.post('/ollama/generate', {
        prompt: values.prompt,
      }, {
        timeout: 60000,
      });

      setPreviewContent(response.text || '');
      setIsPreviewModalVisible(true);
      message.success('AI 内容生成成功');
    } catch (error: unknown) {
      message.error(`生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setPreviewLoading(false);
    }
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
            extra="使用 {{ai_content}} 作为 AI 生成内容的占位符"
          >
            <TextArea rows={6} placeholder="请输入邮件内容，使用 {{ai_content}} 占位符表示 AI 生成的内容" />
          </Form.Item>

          <Divider />

          <Form.Item
            name="use_ai"
            label={
              <Space size={8}>
                <RobotOutlined />
                <Text>启用 AI 生成</Text>
              </Space>
            }
            valuePropName="checked"
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.use_ai !== currentValues.use_ai}>
            {({ getFieldValue }) =>
              getFieldValue('use_ai') ? (
                <>
                  <Alert
                    message="AI 配置说明"
                    description={
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        <li>在邮件内容中使用 <Text code>{`{{ai_content}}`}</Text> 作为占位符</li>
                        <li>系统将在发送邮件时自动生成内容并替换占位符</li>
                        <li>确保 Ollama 服务已启动并正常运行</li>
                      </ul>
                    }
                    type="info"
                    showIcon
                    icon={<InfoCircleOutlined />}
                    style={{ marginBottom: 16 }}
                  />
                  <Form.Item
                    name="prompt"
                    label="AI 提示词"
                    rules={[{ required: true, message: '请输入 AI 提示词' }]}
                    extra="描述您希望 AI 生成的内容，例如：生成一段关于今日天气的温馨问候"
                  >
                    <TextArea
                      rows={4}
                      placeholder="请输入 AI 提示词，例如：生成一段关于今日天气的温馨问候语"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      icon={<RobotOutlined />}
                      onClick={handleGeneratePreview}
                      loading={previewLoading}
                      style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        border: 'none',
                      }}
                    >
                      生成 AI 内容预览
                    </Button>
                  </Form.Item>
                </>
              ) : null
            }
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <Space size={8}>
            <RobotOutlined />
            <Text>AI 生成内容预览</Text>
          </Space>
        }
        open={isPreviewModalVisible}
        onCancel={() => setIsPreviewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsPreviewModalVisible(false)}>
            关闭
          </Button>,
          <Button
            key="copy"
            type="primary"
            onClick={() => {
              navigator.clipboard.writeText(previewContent);
              message.success('已复制到剪贴板');
            }}
          >
            复制内容
          </Button>,
        ]}
        width={600}
      >
        <div
          style={{
            maxHeight: 400,
            overflowY: 'auto',
            padding: '16px',
            background: '#f5f5f5',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {previewContent || '暂无内容'}
        </div>
      </Modal>
        </>
      )}
    </div>
  );
};

export default Templates;
