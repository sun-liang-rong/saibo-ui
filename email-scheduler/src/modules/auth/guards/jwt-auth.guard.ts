import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * JWT 守卫
 *
 * 用于保护需要认证的路由
 *
 * 使用方式：
 * 1. 在控制器或路由上使用 @UseGuards(JwtAuthGuard)
 * 2. 在请求处理前验证 JWT token
 * 3. token 有效则允许访问，无效则返回 401
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 调用父类的 canActivate 方法
    // 会自动验证 JWT token
    return super.canActivate(context);
  }
}
