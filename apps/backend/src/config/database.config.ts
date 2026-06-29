import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/users/user.entity';
import { Project } from '../modules/projects/project.entity';
import { Requirement } from '../modules/requirements/requirement.entity';
import { TestCase } from '../modules/test-cases/test-case.entity';
import { Defect } from '../modules/defects/defect.entity';
import { Environment } from '../modules/environments/environment.entity';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_DATABASE', 'test_management'),
  ssl: configService.get<string>('DB_SSL', 'false') === 'true' ? { rejectUnauthorized: false } : false,
  entities: [User, Project, Requirement, TestCase, Defect, Environment],
  synchronize: configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
  logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
  autoLoadEntities: true,
  retryAttempts: 3,
  retryDelay: 3000,
});
