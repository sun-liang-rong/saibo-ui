import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginDto, RegisterDto, LoginResponseDto } from './dto/auth.dto';

/**
 * 认证服务
 *
 * 功能：
 * 1. 用户登录（验证用户名和密码，生成 JWT）
 * 2. 用户注册（创建新用户）
 * 3. 密码加密（使用 bcrypt）
 * 4. JWT 生成和验证
 *
 * 安全设计：
 * - 密码使用 bcrypt 加密存储
 * - JWT 令牌用于身份验证
 * - 登录时验证用户名和密码
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * 用户登录
   *
   * @param loginDto 登录数据
   * @returns 登录响应（包含 JWT token）
   *
   * 业务逻辑：
   * 1. 根据用户名查找用户
   * 2. 验证密码是否正确
   * 3. 生成 JWT token
   * 4. 返回 token 和用户信息
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto;

    this.logger.log(`用户登录尝试: ${username}`);

    // 1. 查找用户
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      this.logger.warn(`用户不存在: ${username}`);
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 2. 验证密码
    const isPasswordValid = await this.validatePassword(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`密码错误: ${username}`);
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 3. 检查用户是否激活
    if (!user.is_active) {
      this.logger.warn(`用户已禁用: ${username}`);
      throw new UnauthorizedException('用户已被禁用');
    }

    // 4. 生成 JWT token
    const payload = {
      sub: user.id,
      username: user.username,
    };

    const access_token = this.jwtService.sign(payload);

    this.logger.log(`用户登录成功: ${username}`);

    // 5. 返回响应
    return {
      access_token,
      token_type: 'Bearer',
      expires_in: 3600, // 1 小时
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  /**
   * 用户注册
   *
   * @param registerDto 注册数据
   * @returns 创建的用户信息
   *
   * 业务逻辑：
   * 1. 检查用户名是否已存在
   * 2. 加密密码
   * 3. 创建用户
   * 4. 返回用户信息（不包含密码）
   */
  async register(registerDto: RegisterDto): Promise<{
    id: number;
    username: string;
    email: string | null;
  }> {
    const { username, password, email } = registerDto;

    this.logger.log(`用户注册尝试: ${username}`);

    // 1. 检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      this.logger.warn(`用户名已存在: ${username}`);
      throw new UnauthorizedException('用户名已存在');
    }

    // 2. 加密密码
    const hashedPassword = await this.hashPassword(password);

    // 3. 创建用户
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      email,
      is_active: true,
    });

    const savedUser = await this.userRepository.save(user);

    this.logger.log(`用户注册成功: ${username}`);

    // 4. 返回用户信息（不包含密码）
    return {
      id: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
    };
  }

  /**
   * 验证用户（用于 JWT 策略）
   *
   * @param userId 用户 ID
   * @returns 用户信息
   */
  async validateUser(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || !user.is_active) {
      return null;
    }

    return user;
  }

  /**
   * 加密密码
   *
   * @param password 明文密码
   * @returns 加密后的密码
   *
   * 使用 bcrypt 加密，盐值轮数为 10
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * 验证密码
   *
   * @param plainPassword 明文密码
   * @param hashedPassword 加密后的密码
   * @returns 是否匹配
   */
  private async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
