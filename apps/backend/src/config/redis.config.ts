import { ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';

export const redisConfig = async (configService: ConfigService) => {
  const host = configService.get<string>('REDIS_HOST', 'localhost');
  const port = configService.get<number>('REDIS_PORT', 6379);
  const password = configService.get<string>('REDIS_PASSWORD', '');
  const db = configService.get<number>('REDIS_DB', 0);
  const ttl = configService.get<number>('REDIS_TTL', 3600);

  const redisUrl = password
    ? `redis://:${password}@${host}:${port}/${db}`
    : `redis://${host}:${port}/${db}`;

  return {
    ttl: ttl * 1000,
    stores: [createKeyv(redisUrl)],
  };
};

export const redisClientConfig = (configService: ConfigService) => ({
  host: configService.get<string>('REDIS_HOST', 'localhost'),
  port: configService.get<number>('REDIS_PORT', 6379),
  password: configService.get<string>('REDIS_PASSWORD') || undefined,
  db: configService.get<number>('REDIS_DB', 0),
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError: (err: Error) => {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
  lazyConnect: false,
});
