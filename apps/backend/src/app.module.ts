import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { RequirementsModule } from './modules/requirements/requirements.module';
import { TestCasesModule } from './modules/test-cases/test-cases.module';
import { TestExecutionModule } from './modules/test-execution/test-execution.module';
import { DefectsModule } from './modules/defects/defects.module';
import { AiModule } from './modules/ai/ai.module';
import { ReportsModule } from './modules/reports/reports.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module';
import { EnvironmentsModule } from './modules/environments/environments.module';
import { RtmModule } from './modules/rtm/rtm.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    RequirementsModule,
    TestCasesModule,
    TestExecutionModule,
    DefectsModule,
    AiModule,
    ReportsModule,
    KnowledgeBaseModule,
    EnvironmentsModule,
    RtmModule,
    IntegrationsModule,
  ],
})
export class AppModule {}
