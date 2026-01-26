import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  message,
  Space,
  Card,
  Select,
  Checkbox,
} from 'antd';
import { MailOutlined, ClockCircleOutlined, SendOutlined, CalendarOutlined, CloudOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { createEmailTask, updateEmailTask } from '../services/emailService';

const { TextArea } = Input;

/**
 * 邮件任务表单组件
 *
 * 功能：
 * 1. 创建新的邮件任务
 * 2. 编辑现有的邮件任务（仅限待发送状态）
 * 3. 表单验证（邮箱格式、必填项等）
 * 4. 支持 HTML 邮件内容
 *
 * @param {Object} props
 * @param {boolean} props.visible - 是否显示模态框
 * @param {Function} props.onCancel - 取消回调
 * @param {Function} props.onSuccess - 成功回调
 * @param {Object} props.editData - 编辑数据（可选）
 */
const EmailTaskForm = ({ visible, onCancel, onSuccess, editData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // 每次弹窗打开（visible 变为 true）时，同步数据
  useEffect(() => {
    form.resetFields();
    if (visible) {
      if (editData) {
        // 编辑模式：设置值（自动转 dayjs 如果有日期字段）
        form.setFieldsValue({
          ...editData,
          // 示例：如果有日期字段
          send_time: editData.send_time ? dayjs(editData.send_time) : null,
        });
      } else {
        console.log('新建模式')
        // 新建模式：清空表单
        form.setFieldsValue({
          send_time: getDefaultSendTime(),
          frequency: editData?.frequency || 'once'
        })
      }
    } 
  }, [visible, editData, form]);
  /**
   * 重置表单
   */
  const resetForm = () => {
    form.resetFields();
  };

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    try {
      // 验证表单
      const values = await form.validateFields();

      setLoading(true);

      // 格式化发送时间为 ISO 8601 格式
      // 后端要求的格式：yyyy-MM-ddTHH:mm:ssZ
      const sendTime = values.send_time.format('YYYY-MM-DDTHH:mm:ssZ');

      // 构建请求数据
      const data = {
        to_email: values.to_email,
        subject: values.subject,
        content: values.content,
        send_time: sendTime,
        frequency: values.frequency || 'once',
        week_day: values.week_day || null,
        include_weather: values.include_weather || false,
        weather_city: values.include_weather ? values.weather_city : null,
      };

      // 调用 API 创建或更新邮件任务
      if (editData) {
        // 更新模式
        await updateEmailTask(editData.id, data);
        message.success('邮件任务更新成功！');
      } else {
        // 创建模式
        await createEmailTask(data);
        message.success('邮件任务创建成功！');
      }

      // 重置表单并关闭模态框
      resetForm();
      onSuccess();

      setLoading(false);
    } catch (error) {
      console.error('表单验证失败或提交失败:', error);
      // 显示错误信息
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('提交失败，请稍后重试');
      }
      setLoading(false);
    }
  };

  /**
   * 取消操作
   */
  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  /**
   * 设置发送时间的初始值
   * 如果是编辑模式，使用原有的发送时间
   * 否则，默认为当前时间 + 1 小时
   */
  const getDefaultSendTime = () => {
    if (editData?.send_time) {
      return dayjs(editData.send_time);
    }
    return dayjs().add(1, 'hour');
  };

  return (
    <Modal
      title={editData ? '编辑邮件任务' : '创建新的邮件任务'}
      open={visible}
      onCancel={handleCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          icon={<SendOutlined />}
        >
          {editData ? '更新' : '创建'}
        </Button>,
      ]}
    >
      <Form
        preserve={false}
        form={form}
        layout="vertical"
      >
        {/* 收件人邮箱 */}
        <Form.Item
          label="收件人邮箱"
          name="to_email"
          initialValue={editData?.to_email || ''}
          rules={[
            { required: true, message: '请输入收件人邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="例如：user@example.com"
            size="large"
          />
        </Form.Item>

        {/* 邮件标题 */}
        <Form.Item
          label="邮件标题"
          name="subject"
          initialValue={editData?.subject || ''}
          rules={[
            { required: true, message: '请输入邮件标题' },
            { max: 500, message: '邮件标题不能超过500个字符' },
          ]}
        >
          <Input
            placeholder="请输入邮件标题"
            size="large"
          />
        </Form.Item>

        {/* 邮件内容 */}
        <Form.Item
          label="邮件内容"
          name="content"
          initialValue={editData?.content || ''}
          rules={[
            { required: true, message: '请输入邮件内容' },
          ]}
          extra="支持 HTML 格式，例如：<h1>标题</h1><p>内容</p>"
        >
          <TextArea
            rows={8}
            placeholder="请输入邮件内容，支持 HTML 格式"
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>

        {/* 预览区域 */}
        <Form.Item label="内容预览">
          <Card size="small" style={{ background: '#f5f5f5' }}>
            <div
              dangerouslySetInnerHTML={{
                __html: form.getFieldValue('content') || '<span style="color: #999;">暂无内容</span>',
              }}
              style={{
                maxHeight: 200,
                overflow: 'auto',
                padding: 10,
                background: 'white',
                border: '1px solid #d9d9d9',
                borderRadius: 4,
              }}
            />
          </Card>
        </Form.Item>

        {/* 调度频率 */}
        <Form.Item
          label="调度频率"
          name="frequency"
          rules={[{ required: true, message: '请选择调度频率' }]}
        >
          <Select
            placeholder="请选择调度频率"
            size="large"
            onChange={(value) => {
              // 当频率改变时，重置星期几字段
              if (value !== 'weekly') {
                form.setFieldValue('week_day', undefined);
              }
            }}
          >
            <Select.Option value="once">单次发送</Select.Option>
            <Select.Option value="daily">每天发送</Select.Option>
            <Select.Option value="weekly">每周发送</Select.Option>
          </Select>
        </Form.Item>

        {/* 星期几（仅当选择每周时显示） */}
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.frequency !== currentValues.frequency}>
          {({ getFieldValue }) =>
            getFieldValue('frequency') === 'weekly' ? (
              <Form.Item
                label="星期几"
                name="week_day"
                rules={[{ required: true, message: '请选择星期几' }]}
                initialValue={editData?.week_day}
              >
                <Select
                  placeholder="请选择星期几"
                  size="large"
                >
                  <Select.Option value={1}>星期一</Select.Option>
                  <Select.Option value={2}>星期二</Select.Option>
                  <Select.Option value={3}>星期三</Select.Option>
                  <Select.Option value={4}>星期四</Select.Option>
                  <Select.Option value={5}>星期五</Select.Option>
                  <Select.Option value={6}>星期六</Select.Option>
                  <Select.Option value={7}>星期日</Select.Option>
                </Select>
              </Form.Item>
            ) : null
          }
        </Form.Item>

        {/* 天气信息选项 */}
        <Form.Item
          label="包含今日天气"
          name="include_weather"
          valuePropName="checked"
          initialValue={editData?.include_weather || false}
        >
          <Checkbox>在邮件中添加今日天气信息</Checkbox>
        </Form.Item>

        {/* 城市名称（仅当勾选包含天气时显示） */}
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.include_weather !== currentValues.include_weather}>
          {({ getFieldValue }) =>
            getFieldValue('include_weather') ? (
              <Form.Item
                label="城市"
                name="weather_city"
                rules={[{ required: true, message: '请输入城市名称' }]}
                initialValue={editData?.weather_city}
                extra="输入需要查询天气的城市名称，例如：北京、上海、深圳"
              >
                <Input
                  placeholder="请输入城市名称"
                  size="large"
                  prefix={<CloudOutlined />}
                />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        {/* 发送时间 */}
        <Form.Item
          label="发送时间"
          name="send_time"
          rules={[
            { required: true, message: '请选择发送时间' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const now = dayjs();
                if (value.isBefore(now)) {
                  return Promise.reject(new Error('发送时间必须在未来'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择发送时间"
            size="large"
            style={{ width: '100%' }}
            disabledDate={(current) => {
              // 禁用过去的日期
              return current && current < dayjs().startOf('day');
            }}
            suffixIcon={<ClockCircleOutlined />}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmailTaskForm;
