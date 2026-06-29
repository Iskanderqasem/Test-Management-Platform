import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Defect } from './defect.entity';
import { DefectsService } from './defects.service';
import { DefectsController } from './defects.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Defect]), AiModule],
  providers: [DefectsService],
  controllers: [DefectsController],
  exports: [DefectsService],
})
export class DefectsModule {}
