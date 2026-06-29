import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EnvironmentStatus { HEALTHY = 'healthy', DEGRADED = 'degraded', DOWN = 'down' }

@Entity('environments')
export class Environment {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column() type: string;
  @Column({ nullable: true }) url: string;
  @Column({ type: 'enum', enum: EnvironmentStatus, default: EnvironmentStatus.HEALTHY }) status: EnvironmentStatus;
  @Column({ nullable: true }) responseTime: number;
  @Column({ type: 'decimal', default: 100 }) uptime: number;
  @Column({ nullable: true }) projectId: string;
  @Column({ type: 'jsonb', default: {} }) metadata: Record<string, any>;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
