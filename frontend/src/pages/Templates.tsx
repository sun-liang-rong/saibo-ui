import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Card, Descriptions, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import request from '../utils/request';

interface EmailTemplate {
  id: number;
  subject: string;
  body: string;
  to_email: string;
  type: string;
  created_at: string;
}

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [previewData, setPreviewData] = useState<EmailTemplate | null>(null);
  const [templateType, setTemplateType] = useState<string>('custom');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const fetchTemplates = async (currentPage?: number, currentPageSize?: number) => {
    setLoading(true);
    try {
      const p = currentPage ?? page;
      const ps = currentPageSize ?? pageSize;
      const res: any = await request.get('/templates', { params: { page: p, pageSize: ps } });
      setTemplates(res.data || []);
      setTotal(res.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await request.put(`/templates/${editingId}`, values);
        message.success('更新成功');
      } else {
        await request.post('/templates', values);
        message.success('创建成功');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchTemplates();
    } catch (error) {
      // handled
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/templates/${id}`);
      message.success('删除成功');
      fetchTemplates();
    } catch (error) {
      // handled
    }
  };

  const openEdit = (record: EmailTemplate) => {
    setEditingId(record.id);
    setTemplateType(record.type || 'custom');
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handlePreview = async () => {
    try {
      const values = await form.validateFields();
      setPreviewData(values as EmailTemplate);
      setIsPreviewOpen(true);
    } catch (error) {
      // handled
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '主题', dataIndex: 'subject', key: 'subject' },
    { title: '收件人', dataIndex: 'to_email', key: 'to_email' },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: { [key: string]: string } = {
          weather: '天气',
          news: '新闻',
          gold: '黄金',
          custom: '自定义',
        };
        return typeMap[type] || '自定义';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: EmailTemplate) => (
        <>
          <Button icon={<EditOutlined />} type="link" onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} type="link" danger>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setTemplateType('custom');
            setIsModalOpen(true);
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
          showTotal: (t) => `共 ${t} 条`,
        }}
      />

      <Modal
        title={editingId ? '编辑模板' : '新建模板'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        width={600}
        footer={[
          <Button key="preview" icon={<EyeOutlined />} onClick={handlePreview}>
            预览
          </Button>,
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {editingId ? '更新' : '创建'}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="subject"
            label="主题"
            rules={[{ required: true, message: '请输入主题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="to_email"
            label="收件人邮箱"
            rules={[{ required: true, message: '请输入收件人邮箱' }, { type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select onChange={(value) => setTemplateType(value)}>
              <Select.Option value="weather">天气</Select.Option>
              <Select.Option value="news">新闻</Select.Option>
              <Select.Option value="gold">黄金</Select.Option>
              <Select.Option value="custom">自定义</Select.Option>
            </Select>
          </Form.Item>
          {templateType === 'custom' && (
            <Form.Item
              name="body"
              label="内容"
              rules={[{ required: true, message: '请输入内容' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          )}
        </Form>
      </Modal>

      <Modal
        title="邮件预览"
        open={isPreviewOpen}
        onCancel={() => setIsPreviewOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsPreviewOpen(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {previewData && (
          <Card>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="收件人">{previewData.to_email}</Descriptions.Item>
              <Descriptions.Item label="主题">{previewData.subject}</Descriptions.Item>
              <Descriptions.Item label="类型">
                {(() => {
                  const typeMap: { [key: string]: string } = {
                    weather: '天气',
                    news: '新闻',
                    custom: '自定义',
                  };
                  return typeMap[previewData.type] || '自定义';
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="内容">
                {previewData.type === 'custom' ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: previewData.body }}
                    style={{ 
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      minHeight: '100px',
                      backgroundColor: '#fafafa'
                    }}
                  />
                ) : (
                  <div style={{ 
                    padding: '12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    minHeight: '100px',
                    backgroundColor: '#fafafa',
                    color: '#999'
                  }}>
                    {previewData.type === 'weather' ? '使用天气信息' : '使用新闻信息'}
                  </div>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default Templates;
