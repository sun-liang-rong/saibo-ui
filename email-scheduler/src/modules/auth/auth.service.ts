import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginDto, RegisterDto, LoginResponseDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto;

    this.logger.log(`用户登录尝试: ${username}`);

    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      this.logger.warn(`用户不存在: ${username}`);
      throw new UnauthorizedException('用户名或密码错误');
    }

    const isPasswordValid = await this.validatePassword(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`密码错误: ${username}`);
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload = {
      sub: user.id,
      username: user.username,
    };
    // 加入token失效时间为1小时
    const access_token = this.jwtService.sign(payload, { expiresIn: this.configService.get('JWT_EXPIRES_IN') });

    this.logger.log(`用户登录成功: ${username}`);

    return {
      access_token,
      token_type: 'Bearer',
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<{
    id: number;
    username: string;
  }> {
    const { username, password } = registerDto;

    this.logger.log(`用户注册尝试: ${username}`);

    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      this.logger.warn(`用户名已存在: ${username}`);
      throw new UnauthorizedException('用户名已存在');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    this.logger.log(`用户注册成功: ${username}`);

    return {
      id: savedUser.id,
      username: savedUser.username,
    };
  }

  async validateUser(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
