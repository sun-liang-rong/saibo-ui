import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { VideoInfoDto } from './dto/parse-video.dto';

@Injectable()
export class DouyinService {
  private readonly logger = new Logger(DouyinService.name);

  /**
   * 解析抖音分享链接，获取无水印视频信息
   * @param shareUrl 抖音分享链接（如：https://v.douyin.com/xxxxx/）
   * @returns 视频信息
   */
  async parseVideo(shareUrl: string): Promise<VideoInfoDto> {
    try {
      this.logger.log(`开始解析抖音链接: ${shareUrl}`);

      // 1. 解析短链，获取重定向后的真实 URL
      const realUrl = await this.resolveShortUrl(shareUrl);
      this.logger.log(`解析到真实 URL: ${realUrl}`);

      // 2. 从 URL 中提取 aweme_id
      const awemeId = this.extractAwemeId(realUrl);
      if (!awemeId) {
        throw new HttpException('无法从链接中提取视频ID', HttpStatus.BAD_REQUEST);
      }
      this.logger.log(`提取到视频ID: ${awemeId}`);

      // 3. 调用抖音 API 获取视频信息
      const videoInfo = await this.fetchVideoInfo(awemeId);
      this.logger.log(`成功获取视频信息: ${videoInfo.title}`);

      return videoInfo;
    } catch (error) {
      this.logger.error(`解析抖音视频失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 解析抖音短链，获取重定向后的真实 URL
   * @param shortUrl 短链（如：https://v.douyin.com/xxxxx/）
   * @returns 真实 URL
   */
  private async resolveShortUrl(shortUrl: string): Promise<string> {
    try {
      // 发送 GET 请求，不跟随重定向，获取 Location 头
      const response: AxiosResponse = await axios.get(shortUrl, {
        maxRedirects: 0, // 不自动跟随重定向
        validateStatus: (status) => status >= 200 && status < 400, // 接受 3xx 状态码
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
        },
      });
      console.log(response, 'response')
      // 从重定向响应中获取 Location 头
      let realUrl = response.headers.location || response.request.res.responseUrl || shortUrl;
      
      // 如果是 3xx 重定向，手动获取 Location
      if (response.status >= 300 && response.status < 400 && response.headers.location) {
        realUrl = response.headers.location;
      }

      // 如果还是短链格式，可能需要再次解析
      if (realUrl.includes('v.douyin.com')) {
        return this.resolveShortUrl(realUrl);
      }

      return realUrl;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status >= 300 && error.response?.status < 400) {
        // 重定向错误，从响应中获取 Location
        const location = error.response.headers.location;
        if (location) {
          return location;
        }
      }
      
      this.logger.error(`解析短链失败: ${error.message}`);
      throw new HttpException('解析分享链接失败，请检查链接是否正确', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 从 URL 中提取 aweme_id
   * @param url 抖音视频 URL
   * @returns aweme_id
   */
  private extractAwemeId(url: string): string | null {
    // 匹配 /video/xxxxxx 格式
    const videoMatch = url.match(/\/video\/(\d+)/);
    if (videoMatch) {
      return videoMatch[1];
    }

    // 匹配 ?video_id=xxxxxx 格式
    const videoIdMatch = url.match(/[?&]video_id=(\d+)/);
    if (videoIdMatch) {
      return videoIdMatch[1];
    }

    // 匹配 /share/video/xxxxxx 格式
    const shareMatch = url.match(/\/share\/video\/(\d+)/);
    if (shareMatch) {
      return shareMatch[1];
    }

    // 匹配 aweme_id=xxxxxx 格式
    const awemeMatch = url.match(/[?&]aweme_id=(\d+)/);
    if (awemeMatch) {
      return awemeMatch[1];
    }

    return null;
  }

  /**
   * 调用抖音 API 获取视频信息
   * @param awemeId 视频ID
   * @returns 视频信息
   */
  private async fetchVideoInfo(awemeId: string): Promise<VideoInfoDto> {
    try {
      // 使用抖音 web API 获取视频信息
      const apiUrl = `https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${awemeId}`;
      
      const response: AxiosResponse = await axios.get(apiUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.douyin.com/',
        },
      });

      if (!response.data || !response.data.item_list || response.data.item_list.length === 0) {
        throw new HttpException('无法获取视频信息，视频可能已被删除或设为私密', HttpStatus.NOT_FOUND);
      }

      const item = response.data.item_list[0];
      
      // 提取视频信息
      const videoInfo: VideoInfoDto = {
        title: item.desc || '无标题',
        author: item.author?.nickname || '未知作者',
        authorAvatar: item.author?.avatar?.thumb?.url_list?.[0] || '',
        cover: item.video?.cover?.url_list?.[0] || '',
        awemeId: awemeId,
        videoUrl: this.extractVideoUrl(item),
        duration: item.video?.duration ? Math.floor(item.video.duration / 1000) : undefined,
        diggCount: item.statistics?.digg_count || 0,
        commentCount: item.statistics?.comment_count || 0,
        shareCount: item.statistics?.share_count || 0,
      };

      return videoInfo;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(`请求抖音 API 失败: ${error.message}`, error.response?.data);
        throw new HttpException(
          `获取视频信息失败: ${error.message}`,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }

  /**
   * 从视频数据中提取无水印视频地址
   * @param item 视频数据
   * @returns 无水印视频地址
   */
  private extractVideoUrl(item: any): string {
    const video = item.video;
    if (!video) {
      return '';
    }

    // 优先使用 play_addr_lowbr（无水印）
    if (video.play_addr_lowbr?.url_list?.length > 0) {
      return video.play_addr_lowbr.url_list[0];
    }

    // 其次使用 play_addr（可能无水印）
    if (video.play_addr?.url_list?.length > 0) {
      // 替换域名获取无水印版本
      let url = video.play_addr.url_list[0];
      // 将 playwm 替换为 play（去除水印）
      url = url.replace('playwm', 'play');
      return url;
    }

    // 备用方案：使用 download_addr
    if (video.download_addr?.url_list?.length > 0) {
      return video.download_addr.url_list[0];
    }

    return '';
  }

  /**
   * 直接通过 aweme_id 获取视频信息（备用方法）
   * @param awemeId 视频ID
   * @returns 视频信息
   */
  async getVideoById(awemeId: string): Promise<VideoInfoDto> {
    return this.fetchVideoInfo(awemeId);
  }
}
