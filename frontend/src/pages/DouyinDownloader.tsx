import React, { useState } from 'react';
import { Card, Input, Button, message, Spin, Image, Typography, Space, Tag, Descriptions } from 'antd';
import { DownloadOutlined, PlayCircleOutlined, UserOutlined, HeartOutlined, MessageOutlined, ShareAltOutlined } from '@ant-design/icons';
import request from '../utils/request';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface VideoInfo {
  title: string;
  author: string;
  authorAvatar: string;
  cover: string;
  videoUrl: string;
  awemeId: string;
  duration?: number;
  diggCount?: number;
  commentCount?: number;
  shareCount?: number;
}

const DouyinDownloader: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  const handleParse = async () => {
    if (!url.trim()) {
      message.error('请输入抖音分享链接');
      return;
    }

    // 简单验证链接格式
    if (!url.includes('douyin.com')) {
      message.error('请输入有效的抖音链接');
      return;
    }

    setLoading(true);
    setVideoInfo(null);

    try {
      const response: any = await request.post('/douyin/parse', { url: url.trim() });
      
      if (response.success && response.data) {
        setVideoInfo(response.data);
        message.success('解析成功！');
      } else {
        message.error(response.error || '解析失败');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '解析失败，请检查链接是否正确');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!videoInfo?.videoUrl) {
      message.error('视频地址无效');
      return;
    }

    // 创建临时链接下载
    const link = document.createElement('a');
    link.href = videoInfo.videoUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // 尝试设置下载文件名
    const filename = `${videoInfo.author}_${videoInfo.awemeId}.mp4`;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success('开始下载...');
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  return (
    <div>
      <Title level={2}>抖音去水印下载</Title>
      <Text type="secondary">粘贴抖音分享链接，一键下载无水印视频</Text>

      <Card style={{ marginTop: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong>抖音分享链接：</Text>
            <TextArea
              placeholder="请粘贴抖音分享链接，例如：https://v.douyin.com/xxxxx/"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              rows={3}
              style={{ marginTop: 8 }}
            />
          </div>

          <Button
            type="primary"
            size="large"
            onClick={handleParse}
            loading={loading}
            block
          >
            {loading ? '解析中...' : '解析视频'}
          </Button>
        </Space>
      </Card>

      {loading && (
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>正在解析视频信息...</p>
        </div>
      )}

      {videoInfo && !loading && (
        <Card style={{ marginTop: 24 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* 视频封面 */}
            <div style={{ textAlign: 'center' }}>
              <Image
                src={videoInfo.cover}
                alt="视频封面"
                style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8 }}
                preview={false}
              />
            </div>

            {/* 视频信息 */}
            <Descriptions title="视频信息" bordered column={2}>
              <Descriptions.Item label="标题" span={2}>
                <Text ellipsis={{ tooltip: videoInfo.title }} style={{ maxWidth: 400 }}>
                  {videoInfo.title}
                </Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="作者">
                <Space>
                  {videoInfo.authorAvatar && (
                    <img 
                      src={videoInfo.authorAvatar} 
                      alt="avatar" 
                      style={{ width: 24, height: 24, borderRadius: '50%' }} 
                    />
                  )}
                  <UserOutlined />
                  {videoInfo.author}
                </Space>
              </Descriptions.Item>
              
              <Descriptions.Item label="视频ID">
                <Tag color="blue">{videoInfo.awemeId}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="时长">
                <PlayCircleOutlined /> {formatDuration(videoInfo.duration)}
              </Descriptions.Item>
              
              <Descriptions.Item label="互动数据">
                <Space>
                  <Tag icon={<HeartOutlined />} color="red">
                    {formatNumber(videoInfo.diggCount)}
                  </Tag>
                  <Tag icon={<MessageOutlined />} color="blue">
                    {formatNumber(videoInfo.commentCount)}
                  </Tag>
                  <Tag icon={<ShareAltOutlined />} color="green">
                    {formatNumber(videoInfo.shareCount)}
                  </Tag>
                </Space>
              </Descriptions.Item>
            </Descriptions>

            {/* 下载按钮 */}
            <Button
              type="primary"
              size="large"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              block
              style={{ height: 48, fontSize: 16 }}
            >
              下载无水印视频
            </Button>

            <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
              如果下载没有自动开始，请右键点击按钮选择"在新标签页打开链接"
            </Text>
          </Space>
        </Card>
      )}
    </div>
  );
};

export default DouyinDownloader;
