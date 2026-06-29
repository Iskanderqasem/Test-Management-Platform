import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment } from './environment.entity';

@Module({ imports: [TypeOrmModule.forFeature([Environment])] })
export class EnvironmentsModule {}
