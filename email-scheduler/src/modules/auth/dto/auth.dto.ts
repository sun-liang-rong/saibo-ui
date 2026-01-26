import { IsNotEmpty, IsString, MinLength, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 登录请求 DTO
 *
 * 字段说明：
 * - username: 用户名
 * - password: 密码
 */
export class LoginDto {
  @ApiProperty({
    description: '用户名',
    example: 'admin',
  })
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({
    description: '登录密码',
    example: 'admin123',
  })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能少于6位' })
  password: string;
}

/**
 * 注册请求 DTO
 *
 * 字段说明：
 * - username: 用户名（唯一）
 * - password: 密码
 * - email: 邮箱（可选）
 */
export class RegisterDto {
  @ApiProperty({
    description: '用户名',
    example: 'newuser',
  })
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(3, { message: '用户名长度不能少于3位' })
  username: string;

  @ApiProperty({
    description: '登录密码',
    example: 'password123',
  })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能少于6位' })
  password: string;

  @ApiPropertyOptional({
    description: '邮箱地址',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email?: string;
}

/**
 * 登录响应 DTO
 *
 * 返回字段：
 * - access_token: JWT 访问令牌
 * - token_type: 令牌类型（Bearer）
 * - expires_in: 过期时间（秒）
 * - user: 用户信息
 */
export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT 访问令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: '令牌类型',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: '过期时间（秒）',
    example: 3600,
  })
  expires_in: number;

  @ApiProperty({
    description: '用户信息',
    type: 'object',
    example: {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
    },
  })
  user: {
    id: number;
    username: string;
    email: string | null;
  };
}
