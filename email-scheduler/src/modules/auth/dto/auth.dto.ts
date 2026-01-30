import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    example: 'password123',
  })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能少于6位' })
  password: string;
}

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
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT 访问令牌',
  })
  access_token: string;

  @ApiProperty({
    description: '令牌类型',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: '用户信息',
    type: 'object',
  })
  user: {
    id: number;
    username: string;
  };
}
