import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, LoginResponseDto } from './dto/auth.dto';

/**
 * 认证控制器
 *
 * 提供的 API 接口：
 * 1. POST /auth/login - 用户登录
 * 2. POST /auth/register - 用户注册
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录
   *
   * POST /auth/login
   *
   * @param loginDto 登录数据
   * @returns 登录响应（包含 JWT token）
   *
   * 业务逻辑：
   * 1. 接收用户名和密码
   * 2. 验证用户名和密码
   * 3. 生成 JWT token
   * 4. 返回 token 和用户信息
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }

  /**
   * 用户注册
   *
   * POST /auth/register
   *
   * @param registerDto 注册数据
   * @returns 创建的用户信息
   *
   * 业务逻辑：
   * 1. 接收用户名、密码和邮箱
   * 2. 检查用户名是否已存在
   * 3. 加密密码并创建用户
   * 4. 返回用户信息（不包含密码）
   */
  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({
    status: 201,
    description: '注册成功',
    schema: {
      properties: {
        id: { type: 'number', example: 1 },
        username: { type: 'string', example: 'newuser' },
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  @ApiResponse({ status: 400, description: '用户名已存在' })
  async register(@Body() registerDto: RegisterDto): Promise<{
    id: number;
    username: string;
    email: string | null;
  }> {
    return await this.authService.register(registerDto);
  }
}
