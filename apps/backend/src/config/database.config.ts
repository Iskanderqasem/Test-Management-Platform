import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../modules/users/user.entity';
import { Project } from '../modules/projects/project.entity';
import { Requirement } from '../modules/requirements/requirement.entity';
import { TestCase } from '../modules/test-cases/test-case.entity';
import { TestRun } from '../modules/test-execution/test-run.entity';
import { TestResult } from '../modules/test-execution/test-result.entity';
import { Defect } from '../modules/defects/defect.entity';
import { Report } from '../modules/reports/report.entity';
import { KnowledgeDocument } from '../modules/knowledge-base/document.entity';
import { Environment } from '../modules/environments/environment.entity';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_DATABASE', 'test_management'),
  schema: configService.get<string>('DB_SCHEMA', 'public'),
  ssl: configService.get<string>('DB_SSL', 'false') === 'true' ? { rejectUnauthorized: false } : false,
  entities: [
    User,
    Project,
    Requirement,
    TestCase,
    TestRun,
    TestResult,
    Defect,
    Report,
    KnowledgeDocument,
    Environment,
  ],
  migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
  synchronize: configService.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
  logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
  migrationsRun: configService.get<string>('DB_MIGRATIONS_RUN', 'false') === 'true',
  autoLoadEntities: true,
  retryAttempts: 5,
  retryDelay: 3000,
  connectTimeoutMS: 10000,
  extra: {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
});

// DataSource for CLI migrations
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'test_management',
  entities: [
    User,
    Project,
    Requirement,
    TestCase,
    TestRun,
    TestResult,
    Defect,
    Report,
    KnowledgeDocument,
    Environment,
  ],
  migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
  synchronize: false,
  logging: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
