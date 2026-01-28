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
  Row,
  Col,
  Tag,
  Divider,
  Avatar,
} from 'antd';
import { MailOutlined, ClockCircleOutlined, SendOutlined, CalendarOutlined, CloudOutlined, FileTextOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { createEmailTask, updateEmailTask } from '../services/emailService';
import { TEMPLATES, getTemplatesByCategory, getCategories } from '../template/templates';

const { TextArea } = Input;

/**
 * 邮件预览卡片组件
 * 展示邮件的实时预览效果
 */
const EmailPreviewCard = ({ subject, content, toEmail, sendTime, includeWeather, weatherCity }) => {
  const [previewVisible, setPreviewVisible] = useState(false);

  // 生成收件人头像颜色
  const avatarColor = toEmail
    ? `hsl(${toEmail.charCodeAt(0) * 10 % 360}, 70%, 45%)`
    : '#1890ff';

  // 生成发件人名称（从邮箱地址提取）
  const senderName = toEmail ? toEmail.split('@')[0] : '收件人';

  return (
    <div>
      <div
        onClick={() => setPreviewVisible(!previewVisible)}
        style={{
          cursor: 'pointer',
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px 8px 0 0',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Space size="middle">
          <EyeOutlined style={{ fontSize: '16px' }} />
          <span style={{ fontWeight: 600, fontSize: '14px' }}>
            邮件预览 {previewVisible ? '（收起）' : '（展开）'}
          </span>
        </Space>
        <Tag color="white" style={{ margin: 0, border: 'none', color: '#667eea' }}>
          实时
        </Tag>
      </div>

      {previewVisible && (
        <Card
          bordered={false}
          style={{
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginTop: -1,
          }}
          bodyStyle={{ padding: 0 }}
        >
          {/* 邮件头部 */}
          <div style={{
            padding: '20px 24px',
            background: '#fafafa',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <Row gutter={[16, 12]} align="middle">
              <Col>
                <Avatar
                  size={48}
                  style={{
                    backgroundColor: avatarColor,
                    fontSize: '20px',
                    fontWeight: 600
                  }}
                  icon={<UserOutlined />}
                />
              </Col>
              <Col flex="1">
                <div style={{ marginBottom: 4 }}>
                  <span style={{
                    fontSize: '14px',
                    color: '#8c8c8c',
                    marginRight: 8
                  }}>
                    收件人：
                  </span>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#262626'
                  }}>
                    {toEmail || '未填写'}
                  </span>
                </div>
                <div>
                  <span style={{
                    fontSize: '14px',
                    color: '#8c8c8c',
                    marginRight: 8
                  }}>
                    主题：
                  </span>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#262626'
                  }}>
                    {subject || '未填写'}
                  </span>
                </div>
              </Col>
            </Row>

            {(sendTime || includeWeather) && (
              <>
                <Divider style={{ margin: '16px 0' }} />
                <Space size="middle" wrap>
                  {sendTime && (
                    <Tag
                      icon={<ClockCircleOutlined />}
                      color="blue"
                      style={{
                        padding: '4px 12px',
                        fontSize: '13px',
                        borderRadius: '4px'
                      }}
                    >
                      发送时间：{dayjs(sendTime).format('YYYY-MM-DD HH:mm')}
                    </Tag>
                  )}
                  {includeWeather && weatherCity && (
                    <Tag
                      icon={<CloudOutlined />}
                      color="cyan"
                      style={{
                        padding: '4px 12px',
                        fontSize: '13px',
                        borderRadius: '4px'
                      }}
                    >
                      包含{weatherCity}天气
                    </Tag>
                  )}
                </Space>
              </>
            )}
          </div>

          {/* 邮件内容预览 */}
          <div style={{
            padding: '24px',
            background: '#fff',
            minHeight: '200px',
            maxHeight: '400px',
            overflow: 'auto'
          }}>
            {content ? (
              <div
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                  fontSize: '14px',
                  lineHeight: '1.8',
                  color: '#262626',
                  wordBreak: 'break-word'
                }}
              />
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#bfbfbf'
              }}>
                <MailOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div style={{ fontSize: '14px' }}>暂无邮件内容</div>
              </div>
            )}
          </div>

          {/* 邮件底部提示 */}
          <div style={{
            padding: '12px 24px',
            background: '#fafafa',
            borderTop: '1px solid #f0f0f0',
            fontSize: '12px',
            color: '#8c8c8c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>此邮件由邮件调度系统自动发送</span>
            <Tag color="default" style={{ margin: 0, fontSize: '11px' }}>
              预览模式
            </Tag>
          </div>
        </Card>
      )}
    </div>
  );
};

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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // 每次弹窗打开（visible 变为 true）时，同步数据
  useEffect(() => {
    if (visible) {
      if (editData) {
        // 编辑模式：设置值
        // 注意：只设置表单需要的字段，避免传入不需要的后端字段
        const formData = {
          to_email: editData.to_email || '',
          subject: editData.subject || '',
          content: editData.content || '',
          send_time: editData.send_time ? dayjs(editData.send_time) : getDefaultSendTime(),
          frequency: editData.frequency || 'once',
          week_day: editData.week_day || undefined,
          anniversary_month: editData.anniversary_month || undefined,
          anniversary_day: editData.anniversary_day || undefined,
          include_weather: editData.include_weather || false,
          weather_city: editData.weather_city || '',
          template_category: editData.template_category || undefined,
          template_id: editData.template_id || undefined,
        };

        // 先设置模板选择状态
        if (editData.template_category) {
          setSelectedCategory(editData.template_category);
          if (editData.template_id) {
            setSelectedTemplate(editData.template_id);
          } else {
            setSelectedTemplate(null);
          }
        } else {
          setSelectedCategory(null);
          setSelectedTemplate(null);
        }

        // 使用 setTimeout 确保表单已完全渲染后再设置值
        // 这样可以避免第一次渲染时表单还没准备好导致的反显问题
        setTimeout(() => {
          form.setFieldsValue(formData);
        }, 0);
      } else {
        // 新建模式：重置表单并设置默认值
        form.resetFields();
        const defaultFormData = {
          to_email: '',
          subject: '',
          content: '',
          send_time: getDefaultSendTime(),
          frequency: 'once',
          week_day: undefined,
          anniversary_month: undefined,
          anniversary_day: undefined,
          include_weather: false,
          weather_city: '',
          template_category: undefined,
          template_id: undefined,
        };
        form.setFieldsValue(defaultFormData);
        // 重置分类选择和模板选择
        setSelectedCategory(null);
        setSelectedTemplate(null);
      }
    }
    // 移除 form 依赖,避免因为 form 引用变化导致的问题
  }, [visible, editData]);
  /**
   * 重置表单
   */
  const resetForm = () => {
    form.resetFields();
    setSelectedCategory(null);
    setSelectedTemplate(null);
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
        anniversary_month: values.anniversary_month || null,
        anniversary_day: values.anniversary_day || null,
        include_weather: values.include_weather || false,
        weather_city: values.include_weather ? values.weather_city : null,
        template_category: selectedCategory || null,
        template_id: selectedTemplate || null,
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

  /**
   * 处理模板选择
   */
  const handleTemplateChange = (templateId) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
      form.setFieldsValue({
        subject: template.subject,
        content: template.content,
      });
      message.success(`已应用模板：${template.name}`);
    }
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
        key={editData ? `edit-${editData.id}` : 'create'}
        preserve={false}
        form={form}
        layout="vertical"
      >
        {/* 模板选择 */}
        <Form.Item label="选择模板">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Select
              placeholder="选择分类筛选模板"
              size="large"
              allowClear
              onChange={(value) => {
                setSelectedCategory(value);
                // 切换分类时清除已选择的模板
                setSelectedTemplate(null);
              }}
              value={selectedCategory}
            >
              {getCategories().map(category => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="或直接选择模板"
              size="large"
              allowClear
              onChange={(value) => {
                handleTemplateChange(value);
                setSelectedTemplate(value);
              }}
              value={selectedTemplate}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {(selectedCategory ? getTemplatesByCategory(selectedCategory) : TEMPLATES).map(template => (
                <Select.Option key={template.id} value={template.id} label={template.name}>
                  <Space>
                    <FileTextOutlined />
                    <span>{template.name}</span>
                    <Tag color="blue" style={{ fontSize: '12px' }}>{template.category}</Tag>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Space>
        </Form.Item>

        {/* 收件人邮箱 */}
        <Form.Item
          label="收件人邮箱"
          name="to_email"
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
          rules={[
            { required: true, message: '请输入邮件标题' },
            { max: 500, message: '邮件标题不能超过500个字符' },
          ]}
        >
          <Input
            type="search"
            name="subject"
            autoComplete="off"
            placeholder="请输入邮件标题"
            size="large"
          />
        </Form.Item>

        {/* 邮件内容 */}
        <Form.Item
          label="邮件内容"
          name="content"
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

        {/* 邮件内容预览 - 实时响应表单变化 */}
        <Form.Item label="邮件预览">
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => {
            return prevValues.to_email !== currentValues.to_email ||
              prevValues.subject !== currentValues.subject ||
              prevValues.content !== currentValues.content ||
              prevValues.send_time !== currentValues.send_time ||
              prevValues.include_weather !== currentValues.include_weather ||
              prevValues.weather_city !== currentValues.weather_city;
          }}>
            {({ getFieldValue }) => {
              const toEmail = getFieldValue('to_email');
              const subject = getFieldValue('subject');
              const content = getFieldValue('content');
              const sendTime = getFieldValue('send_time');
              const includeWeather = getFieldValue('include_weather');
              const weatherCity = getFieldValue('weather_city');

              return (
                <EmailPreviewCard
                  subject={subject}
                  content={content}
                  toEmail={toEmail}
                  sendTime={sendTime}
                  includeWeather={includeWeather}
                  weatherCity={weatherCity}
                />
              );
            }}
          </Form.Item>
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
              // 当频率改变时，重置相关字段
              if (value !== 'weekly') {
                form.setFieldValue('week_day', undefined);
              }
              if (value !== 'anniversary') {
                form.setFieldValue('anniversary_month', undefined);
                form.setFieldValue('anniversary_day', undefined);
              }
            }}
          >
            <Select.Option value="once">单次发送</Select.Option>
            <Select.Option value="hourly">每小时发送</Select.Option>
            <Select.Option value="daily">每天发送</Select.Option>
            <Select.Option value="weekly">每周发送</Select.Option>
            <Select.Option value="anniversary">每年纪念日发送</Select.Option>
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

        {/* 纪念日（仅当选择纪念日时显示） */}
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.frequency !== currentValues.frequency}>
          {({ getFieldValue }) =>
            getFieldValue('frequency') === 'anniversary' ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item
                  label="纪念日月份"
                  name="anniversary_month"
                  rules={[{ required: true, message: '请选择纪念日月份' }]}
                  style={{ marginBottom: 8 }}
                >
                  <Select
                    placeholder="请选择月份"
                    size="large"
                  >
                    <Select.Option value={1}>1月</Select.Option>
                    <Select.Option value={2}>2月</Select.Option>
                    <Select.Option value={3}>3月</Select.Option>
                    <Select.Option value={4}>4月</Select.Option>
                    <Select.Option value={5}>5月</Select.Option>
                    <Select.Option value={6}>6月</Select.Option>
                    <Select.Option value={7}>7月</Select.Option>
                    <Select.Option value={8}>8月</Select.Option>
                    <Select.Option value={9}>9月</Select.Option>
                    <Select.Option value={10}>10月</Select.Option>
                    <Select.Option value={11}>11月</Select.Option>
                    <Select.Option value={12}>12月</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="纪念日日期"
                  name="anniversary_day"
                  rules={[{ required: true, message: '请选择纪念日日期' }]}
                >
                  <Select
                    placeholder="请选择日期"
                    size="large"
                  >
                    {Array.from({ length: 31 }, (_, i) => (
                      <Select.Option key={i + 1} value={i + 1}>
                        {i + 1}日
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Space>
            ) : null
          }
        </Form.Item>

        {/* 天气信息选项 */}
        <Form.Item
          label="包含今日天气"
          name="include_weather"
          valuePropName="checked"
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
