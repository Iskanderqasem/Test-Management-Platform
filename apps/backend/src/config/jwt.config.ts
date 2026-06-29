import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>('JWT_SECRET', 'default-secret-change-in-production'),
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
    issuer: configService.get<string>('APP_NAME', 'TestManagementPlatform'),
    audience: configService.get<string>('APP_URL', 'http://localhost:3000'),
  },
});

export const jwtConstants = {
  get secret() {
    return process.env.JWT_SECRET || 'default-secret-change-in-production';
  },
  get refreshSecret() {
    return process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production';
  },
  get expiresIn() {
    return process.env.JWT_EXPIRES_IN || '1h';
  },
  get refreshExpiresIn() {
    return process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  },
};
