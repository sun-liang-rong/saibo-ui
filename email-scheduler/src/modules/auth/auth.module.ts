import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * 认证模块
 *
 * 模块职责：
 * 1. 管理用户认证相关的控制器、服务、实体
 * 2. 配置 JWT 模块和 Passport 策略
 * 3. 导出 AuthService 和 JwtAuthGuard 供其他模块使用
 *
 * 依赖：
 * - TypeORM: 管理用户实体
 * - JWT: 生成和验证 JWT token
 * - Passport: 认证框架
 */
@Module({
  imports: [
    // TypeORM 数据库模块
    TypeOrmModule.forFeature([User]),

    // Passport 认证模块
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT 模块
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // JWT 密钥（从环境变量读取）
        secret: configService.get<string>('JWT_SECRET', 'your-secret-key-change-in-production'),
        // Token 过期时间（1 小时）
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
