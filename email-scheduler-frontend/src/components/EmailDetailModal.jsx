import React from 'react';
import { Modal, Descriptions, Tag, Badge } from 'antd';
import dayjs from 'dayjs';
import { formatEmailStatus, getStatusColor } from '../services/emailService';

/**
 * 邮件详情模态框组件
 *
 * 显示邮件任务的完整信息
 *
 * @param {Object} props
 * @param {boolean} props.visible - 是否显示模态框
 * @param {Object} props.data - 邮件数据
 * @param {Function} props.onCancel - 关闭回调
 */
const EmailDetailModal = ({ visible, data, onCancel }) => {
  if (!data) return null;

  return (
    <Modal
      title="邮件任务详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={2}>
        {/* 基本信息 */}
        <Descriptions.Item label="邮件 ID" span={2}>
          {data.id}
        </Descriptions.Item>

        <Descriptions.Item label="收件人" span={2}>
          {data.to_email}
        </Descriptions.Item>

        <Descriptions.Item label="邮件标题" span={2}>
          {data.subject}
        </Descriptions.Item>

        {/* 邮件内容 */}
        <Descriptions.Item label="邮件内容" span={2}>
          <div
            dangerouslySetInnerHTML={{ __html: data.content }}
            style={{
              maxHeight: 300,
              overflow: 'auto',
              padding: 10,
              background: '#f5f5f5',
              borderRadius: 4,
              border: '1px solid #d9d9d9',
            }}
          />
        </Descriptions.Item>

        {/* 时间信息 */}
        <Descriptions.Item label="发送时间">
          {dayjs(data.send_time).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>

        <Descriptions.Item label="状态">
          <Tag color={getStatusColor(data.status)}>
            {formatEmailStatus(data.status)}
          </Tag>
        </Descriptions.Item>

        {/* 实际发送时间 */}
        {data.sent_at && (
          <Descriptions.Item label="实际发送时间" span={2}>
            {dayjs(data.sent_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        )}

        {/* 重试信息 */}
        <Descriptions.Item label="重试次数">
          {data.retry_count > 0 ? (
            <Badge count={data.retry_count} style={{ backgroundColor: '#faad14' }} />
          ) : (
            '-'
          )}
        </Descriptions.Item>

        {/* 错误信息 */}
        {data.error_message && (
          <Descriptions.Item label="错误信息" span={2}>
            <div
              style={{
                padding: 10,
                background: '#fff2f0',
                border: '1px solid #ffccc7',
                borderRadius: 4,
                color: '#f5222d',
              }}
            >
              {data.error_message}
            </div>
          </Descriptions.Item>
        )}

        {/* 时间戳 */}
        <Descriptions.Item label="创建时间">
          {dayjs(data.created_at).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>

        <Descriptions.Item label="更新时间">
          {dayjs(data.updated_at).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default EmailDetailModal;
