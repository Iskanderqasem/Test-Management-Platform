import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../users/user.entity';

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('projects')
@Index(['status'])
@Index(['ownerId'])
export class Project {
  @ApiProperty({ description: 'Project unique identifier' })
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ApiProperty({ example: 'E-Commerce Platform Testing', description: 'Project name' })
  @Column({ length: 200 })
  name: string;

  @ApiPropertyOptional({ description: 'Project description' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ enum: ProjectStatus, default: ProjectStatus.PLANNING })
  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.PLANNING })
  status: ProjectStatus;

  @ApiProperty({ enum: ProjectPriority, default: ProjectPriority.MEDIUM })
  @Column({ type: 'enum', enum: ProjectPriority, default: ProjectPriority.MEDIUM })
  priority: ProjectPriority;

  @ApiPropertyOptional({ description: 'Project start date' })
  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @ApiPropertyOptional({ description: 'Project end date' })
  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @ApiPropertyOptional({ description: 'Target environment (production, staging, etc.)' })
  @Column({ nullable: true, length: 100 })
  environment: string;

  @ApiPropertyOptional({ description: 'Application version under test' })
  @Column({ nullable: true, name: 'app_version', length: 50 })
  appVersion: string;

  @ApiPropertyOptional({ description: 'Technology stack' })
  @Column({ type: 'simple-array', nullable: true, name: 'tech_stack' })
  techStack: string[];

  @ApiPropertyOptional({ description: 'Project tags' })
  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  metadata: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  settings: Record<string, any>;

  @ApiPropertyOptional({ description: 'Project repository URL' })
  @Column({ nullable: true, name: 'repo_url', length: 500 })
  repoUrl: string;

  @ApiPropertyOptional({ description: 'Jira project key' })
  @Column({ nullable: true, name: 'jira_key', length: 50 })
  jiraKey: string;

  @ApiPropertyOptional({ description: 'Azure DevOps project name' })
  @Column({ nullable: true, name: 'ado_project', length: 100 })
  adoProject: string;

  @Column({ default: false, name: 'is_archived' })
  isArchived: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
