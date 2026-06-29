import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';

export enum RequirementType {
  FUNCTIONAL = 'functional',
  NON_FUNCTIONAL = 'non_functional',
  BUSINESS = 'business',
  TECHNICAL = 'technical',
  USER_STORY = 'user_story',
  USE_CASE = 'use_case',
}

export enum RequirementStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  IMPLEMENTED = 'implemented',
  TESTED = 'tested',
  REJECTED = 'rejected',
  DEPRECATED = 'deprecated',
}

export enum RequirementPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('requirements')
@Index(['projectId'])
@Index(['status'])
@Index(['type'])
export class Requirement {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ApiProperty({ example: 'REQ-001', description: 'Requirement identifier' })
  @Column({ name: 'req_id', length: 50 })
  reqId: string;

  @ApiProperty({ description: 'Requirement title' })
  @Column({ length: 500 })
  title: string;

  @ApiPropertyOptional({ description: 'Detailed requirement description' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ enum: RequirementType })
  @Column({ type: 'enum', enum: RequirementType, default: RequirementType.FUNCTIONAL })
  type: RequirementType;

  @ApiProperty({ enum: RequirementStatus, default: RequirementStatus.DRAFT })
  @Column({ type: 'enum', enum: RequirementStatus, default: RequirementStatus.DRAFT })
  status: RequirementStatus;

  @ApiProperty({ enum: RequirementPriority, default: RequirementPriority.MEDIUM })
  @Column({ type: 'enum', enum: RequirementPriority, default: RequirementPriority.MEDIUM })
  priority: RequirementPriority;

  @ApiPropertyOptional({ description: 'Acceptance criteria' })
  @Column({ type: 'text', nullable: true, name: 'acceptance_criteria' })
  acceptanceCriteria: string;

  @ApiPropertyOptional({ description: 'Source document name' })
  @Column({ nullable: true, name: 'source_document', length: 255 })
  sourceDocument: string;

  @ApiPropertyOptional({ description: 'Source document page/section reference' })
  @Column({ nullable: true, name: 'source_reference', length: 100 })
  sourceReference: string;

  @ApiPropertyOptional({ description: 'Parent requirement ID for hierarchical requirements' })
  @Column({ nullable: true, name: 'parent_id', type: 'uuid' })
  parentId: string;

  @ApiPropertyOptional({ description: 'External system ID (Jira, ADO, etc.)' })
  @Column({ nullable: true, name: 'external_id', length: 100 })
  externalId: string;

  @ApiPropertyOptional({ description: 'Requirement tags/labels' })
  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @ApiPropertyOptional({ description: 'AI-generated gap analysis notes' })
  @Column({ type: 'text', nullable: true, name: 'gap_analysis_notes' })
  gapAnalysisNotes: string;

  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdById: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
