import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../../modules/auth/auth.service';
import { User } from '../entities/user.entity';

/**
 * JWT 策略
 *
 * 用于验证 JWT token 并提取用户信息
 *
 * 工作流程：
 * 1. 从请求头中提取 JWT token（Authorization: Bearer <token>）
 * 2. 验证 token 是否有效
 * 3. 解析 token 获取用户 ID
 * 4. 查询用户信息并附加到请求对象
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      // 从 Authorization header 中提取 JWT token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 忽略 token 过期时间（由 JWT 自动验证）
      ignoreExpiration: false,
      // 使用环境变量中的密钥
      secretOrKey: configService.get<string>('JWT_SECRET', 'your-secret-key'),
    });
  }

  /**
   * JWT 验证回调
   *
   * @param payload JWT payload
   * @returns 用户信息
   *
   * 当 token 验证成功后，此方法会被调用
   * 返回的用户信息会被附加到 request.user
   */
  async validate(payload: any): Promise<User> {
    const { sub: userId } = payload;

    const user = await this.authService.validateUser(userId);

    if (!user) {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }

    return user;
  }
}
