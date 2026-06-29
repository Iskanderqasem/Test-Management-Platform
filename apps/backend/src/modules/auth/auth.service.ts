import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '../users/user.entity';
import { RegisterDto, RefreshTokenDto, ChangePasswordDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthResponse {
  user: Partial<User>;
  tokens: AuthTokens;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 12;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: email.toLowerCase(), isActive: true },
      });

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        // Increment failed login attempts
        await this.usersRepository.update(user.id, {
          failedLoginAttempts: (user.failedLoginAttempts || 0) + 1,
          lastFailedLogin: new Date(),
        });
        return null;
      }

      // Reset failed attempts on successful login
      await this.usersRepository.update(user.id, {
        failedLoginAttempts: 0,
        lastLoginAt: new Date(),
      });

      return user;
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`, error.stack);
      return null;
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password, rememberMe } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase(), isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.isLocked) {
      throw new UnauthorizedException('Account is locked. Please contact support.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      await this.usersRepository.update(user.id, {
        failedLoginAttempts: (user.failedLoginAttempts || 0) + 1,
        lastFailedLogin: new Date(),
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update login tracking
    await this.usersRepository.update(user.id, {
      failedLoginAttempts: 0,
      lastLoginAt: new Date(),
    });

    const tokens = await this.generateTokens(user, rememberMe);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, name, role, department } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create user
    const user = this.usersRepository.create({
      id: uuidv4(),
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: role || UserRole.TESTER,
      department,
      isActive: true,
      emailVerified: false,
    });

    try {
      const savedUser = await this.usersRepository.save(user);
      const tokens = await this.generateTokens(savedUser);

      this.logger.log(`New user registered: ${savedUser.email}`);

      return {
        user: this.sanitizeUser(savedUser),
        tokens,
      };
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create account. Please try again.');
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthTokens> {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersRepository.findOne({
        where: { id: payload.sub, isActive: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    await this.usersRepository.update(userId, {
      passwordHash: newPasswordHash,
      passwordChangedAt: new Date(),
    });

    this.logger.log(`Password changed for user: ${user.email}`);
  }

  async logout(userId: string): Promise<void> {
    // In a production system, you would blacklist the JWT token here
    // using Redis or a token blacklist table
    this.logger.log(`User ${userId} logged out`);
  }

  private async generateTokens(user: User, rememberMe = false): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessTokenExpiry = this.configService.get<string>('JWT_EXPIRES_IN', '1h');
    const refreshTokenExpiry = rememberMe
      ? '30d'
      : this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: accessTokenExpiry,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshTokenExpiry,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 hour in seconds
      tokenType: 'Bearer',
    };
  }

  private sanitizeUser(user: User): Partial<User> {
    const { passwordHash, ...sanitized } = user as any;
    return sanitized;
  }
}
