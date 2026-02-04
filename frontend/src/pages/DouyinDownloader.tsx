import React, { useState } from 'react';
import { Card, Input, Button, message, Spin, Image, Typography, Space, Tag, Row, Col, Divider } from 'antd';
import { DownloadOutlined, PlayCircleOutlined, HeartOutlined, MessageOutlined, ShareAltOutlined, VideoCameraOutlined } from '@ant-design/icons';
import request from '../utils/request';

const { Title, Text, Paragraph } = Typography;
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

    const link = document.createElement('a');
    link.href = videoInfo.videoUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

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
      <div style={{ marginBottom: 24 }}>
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
            <VideoCameraOutlined style={{ fontSize: 24, color: '#fff' }} />
          </div>
          <div>
            <Title level={3} style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
              抖音去水印下载
            </Title>
            <Text type="secondary">粘贴抖音分享链接，一键下载无水印视频</Text>
          </div>
        </Space>
      </div>

      <Card style={{ marginBottom: 24 }} bordered={false} styles={{ body: { padding: 24 } }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              抖音分享链接
            </Text>
            <TextArea
              placeholder="请粘贴抖音分享链接，例如：https://v.douyin.com/xxxxx/"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              rows={3}
              style={{ borderRadius: 8 }}
            />
          </div>

          <Button
            type="primary"
            size="large"
            onClick={handleParse}
            loading={loading}
            block
            style={{
              height: 48,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none',
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            {loading ? '解析中...' : '解析视频'}
          </Button>
        </Space>
      </Card>

      {loading && (
        <Card bordered={false} styles={{ body: { padding: 48, textAlign: 'center' } }}>
          <Spin size="large" />
          <Paragraph type="secondary" style={{ marginTop: 16, marginBottom: 0 }}>
            正在解析视频信息...
          </Paragraph>
        </Card>
      )}

      {videoInfo && !loading && (
        <Card bordered={false} styles={{ body: { padding: 24 } }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)' }}>
                <Image
                  src={videoInfo.cover}
                  alt="视频封面"
                  style={{ width: '100%', display: 'block' }}
                  preview={false}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  <PlayCircleOutlined style={{ marginRight: 4 }} />
                  {formatDuration(videoInfo.duration)}
                </div>
              </div>
            </Col>

            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 15 }}>
                    视频标题
                  </Text>
                  <Paragraph ellipsis={{ rows: 2, tooltip: videoInfo.title }} style={{ marginBottom: 0, color: '#64748b' }}>
                    {videoInfo.title}
                  </Paragraph>
                </div>

                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      作者
                    </Text>
                    <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {videoInfo.authorAvatar && (
                        <img
                          src={videoInfo.authorAvatar}
                          alt="avatar"
                          style={{ width: 28, height: 28, borderRadius: '50%' }}
                        />
                      )}
                      <Text strong style={{ fontSize: 14 }}>
                        {videoInfo.author}
                      </Text>
                    </div>
                  </div>

                  <div>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      视频ID
                    </Text>
                    <div style={{ marginTop: 4 }}>
                      <Tag color="blue">{videoInfo.awemeId}</Tag>
                    </div>
                  </div>
                </Space>

                <Divider style={{ margin: '12px 0' }} />

                <div>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 13 }}>
                    互动数据
                  </Text>
                  <Row gutter={12}>
                    <Col span={8}>
                      <div
                        style={{
                          background: '#fef2f2',
                          borderRadius: 8,
                          padding: 12,
                          textAlign: 'center',
                        }}
                      >
                        <HeartOutlined style={{ color: '#ef4444', fontSize: 18 }} />
                        <div style={{ marginTop: 4, fontSize: 16, fontWeight: 600, color: '#1e293b' }}>
                          {formatNumber(videoInfo.diggCount)}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          点赞
                        </Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div
                        style={{
                          background: '#eff6ff',
                          borderRadius: 8,
                          padding: 12,
                          textAlign: 'center',
                        }}
                      >
                        <MessageOutlined style={{ color: '#3b82f6', fontSize: 18 }} />
                        <div style={{ marginTop: 4, fontSize: 16, fontWeight: 600, color: '#1e293b' }}>
                          {formatNumber(videoInfo.commentCount)}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          评论
                        </Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div
                        style={{
                          background: '#f0fdf4',
                          borderRadius: 8,
                          padding: 12,
                          textAlign: 'center',
                        }}
                      >
                        <ShareAltOutlined style={{ color: '#10b981', fontSize: 18 }} />
                        <div style={{ marginTop: 4, fontSize: 16, fontWeight: 600, color: '#1e293b' }}>
                          {formatNumber(videoInfo.shareCount)}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          分享
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </div>

                <Button
                  type="primary"
                  size="large"
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                  block
                  style={{
                    height: 48,
                    fontSize: 15,
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: 'none',
                  }}
                >
                  下载无水印视频
                </Button>

                <Text type="secondary" style={{ textAlign: 'center', display: 'block', fontSize: 12 }}>
                  如果下载没有自动开始，请右键点击按钮选择"在新标签页打开链接"
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default DouyinDownloader;
