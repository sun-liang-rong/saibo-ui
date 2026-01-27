import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { EmailResponseDto } from './dto/email-response.dto';
import { QueryEmailDto } from './dto/create-email.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * 邮件控制器
 *
 * 提供的 API 接口：
 * 1. POST /emails - 创建定时邮件任务
 * 2. GET /emails - 查询邮件列表（分页）
 * 3. GET /emails/:id - 查询单个邮件详情
 * 4. PUT /emails/:id - 更新邮件任务
 * 5. DELETE /emails/:id - 删除邮件任务
 *
 * RESTful 设计原则：
 * - 使用标准的 HTTP 方法（GET、POST、PUT、DELETE）
 * - 使用清晰的 URL 路径
 * - 返回合适的 HTTP 状态码
 * - 使用 Swagger 自动生成 API 文档
 * - 所有接口都需要 JWT 认证（除天气测试接口外）
 */
@ApiTags('emails')
@ApiBearerAuth('JWT-auth') // 添加 Swagger JWT 认证标识
@Controller('emails')
@UseGuards(JwtAuthGuard) // 全局应用 JWT 认证守卫
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('weather-test')
  @ApiOperation({ summary: '天气测试接口' })
  @ApiQuery({ name: 'city', required: true, description: '城市名称' })
  async weatherTest(@Query('city') city): Promise<any> {
    console.log('city', city);
    return this.emailService.weatherTest(city);
  }
  /**
   * 创建定时邮件任务
   *
   * POST /emails
   *
   * @param createEmailDto 邮件数据
   * @returns 创建的邮件任务
   *
   * 业务逻辑：
   * 1. 验证请求体数据（自动验证）
   * 2. 调用 EmailService 创建任务
   * 3. 返回创建的任务信息
   */
  @Post()
  @ApiOperation({ summary: '创建定时邮件任务' })
  @ApiResponse({
    status: 201,
    description: '邮件任务创建成功',
    type: EmailResponseDto,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async create(@Body() createEmailDto: CreateEmailDto): Promise<EmailResponseDto> {
    return await this.emailService.create(createEmailDto);
  }

  /**
   * 查询邮件列表
   *
   * GET /emails?page=1&limit=10&status=pending
   *
   * @param query 查询参数
   * @returns 邮件列表
   *
   * 支持的查询参数：
   * - page: 页码（默认 1）
   * - limit: 每页数量（默认 10）
   * - status: 状态筛选（可选）
   */
  @Get()
  @ApiOperation({ summary: '查询邮件列表' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: '页码' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: '每页数量' })
  @ApiQuery({ name: 'status', required: false, example: 'pending', description: '状态筛选' })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/EmailResponseDto' },
        },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
      },
    },
  })
  async findAll(@Query() query: QueryEmailDto): Promise<{
    data: EmailResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const status = query.status;

    return await this.emailService.findAll(page, limit, status);
  }

  /**
   * 查询单个邮件详情
   *
   * GET /emails/:id
   *
   * @param id 邮件ID
   * @returns 邮件详情
   */
  @Get(':id')
  @ApiOperation({ summary: '查询单个邮件详情' })
  @ApiParam({ name: 'id', description: '邮件ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    type: EmailResponseDto,
  })
  @ApiResponse({ status: 404, description: '邮件任务不存在' })
  async findOne(@Param('id') id: string): Promise<EmailResponseDto> {
    return await this.emailService.findOne(+id);
  }

  /**
   * 更新邮件任务
   *
   * PUT /emails/:id
   *
   * @param id 邮件ID
   * @param updateEmailDto 邮件数据
   * @returns 更新后的邮件任务
   *
   * 业务逻辑：
   * 1. 只能更新待发送状态的邮件
   * 2. 验证发送时间必须在未来
   * 3. 返回更新后的任务信息
   */
  @Put(':id')
  @ApiOperation({ summary: '更新邮件任务' })
  @ApiParam({ name: 'id', description: '邮件ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '邮件任务更新成功',
    type: EmailResponseDto,
  })
  @ApiResponse({ status: 400, description: '请求参数错误或不能更新已发送的邮件' })
  @ApiResponse({ status: 404, description: '邮件任务不存在' })
  async update(
    @Param('id') id: string,
    @Body() updateEmailDto: CreateEmailDto,
  ): Promise<EmailResponseDto> {
    return await this.emailService.update(+id, updateEmailDto);
  }

  /**
   * 删除邮件任务
   *
   * DELETE /emails/:id
   *
   * @param id 邮件ID
   *
   * 业务逻辑：
   * 1. 只能删除待发送或已失败的邮件
   * 2. 已发送的邮件不能删除
   * 3. 返回 204 No Content
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除邮件任务' })
  @ApiParam({ name: 'id', description: '邮件ID', example: 1 })
  @ApiResponse({ status: 204, description: '删除成功' })
  @ApiResponse({ status: 404, description: '邮件任务不存在' })
  @ApiResponse({ status: 400, description: '不能删除已发送的邮件' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.emailService.remove(+id);
  }
  
}
