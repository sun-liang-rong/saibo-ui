import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import request from '../utils/request';
interface Template {
  id: number
  subject: string
  body: string
  to_email: string
  created_at: string,
  updated_at: string
  
}
interface Task {
  id: number
  user_id: number
  email_template_id: number
  schedule: string
  status: string
  created_at:  string
  updated_at: string
}
interface Log {
  id: number;
  task: Task;
  status: string;
  sent_at: string;
  error_msg: string;
}

const History: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [template, setTemplates] = useState<Template []>([])
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const fetchLogs = async (currentPage?: number, currentPageSize?: number) => {
    setLoading(true);
    try {
      const templateRes: any = await request.get('/templates/all');
      setTemplates(templateRes)
      const p = currentPage ?? page;
      const ps = currentPageSize ?? pageSize;
      const res: any = await request.get('/logs', { params: { page: p, pageSize: ps } });
      setLogs(res.data || []);
      setTotal(res.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: '任务ID',
      key: 'taskId',
      render: (_: any, record: Log) => record.task?.id,
    },
    {
      title: '模板',
      key: 'template',
      render: (_: any, record: Log) => {
        let title = template.find(item => item.id === record.task?.email_template_id)?.subject || '-'
        return title
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: '发送时间',
      dataIndex: 'sent_at',
      key: 'sent_at',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    { title: '错误信息', dataIndex: 'error_msg', key: 'error_msg' },
  ];

  return (
    <div>
      <h2>执行历史</h2>
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
          showTotal: (t) => `共 ${t} 条`,
        }}
      />
    </div>
  );
};

export default History;
