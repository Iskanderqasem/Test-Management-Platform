import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'default-secret'),
      issuer: configService.get<string>('APP_NAME', 'TestManagementPlatform'),
      audience: configService.get<string>('APP_URL', 'http://localhost:3000'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { sub: id, email } = payload;

    const user = await this.usersRepository.findOne({
      where: { id, isActive: true },
      select: ['id', 'email', 'name', 'role', 'avatar', 'isActive', 'department'],
    });

    if (!user) {
      this.logger.warn(`JWT validation failed: User ${email} not found or inactive`);
      throw new UnauthorizedException('User not found or account has been deactivated');
    }

    return user;
  }
}
