import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [],
  providers: [],
})
export class ReportsModule {}
