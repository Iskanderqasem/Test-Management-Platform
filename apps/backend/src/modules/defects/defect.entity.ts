import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';

export enum DefectSeverity { CRITICAL = 'Critical', HIGH = 'High', MEDIUM = 'Medium', LOW = 'Low' }
export enum DefectPriority { P1 = 'P1', P2 = 'P2', P3 = 'P3', P4 = 'P4' }
export enum DefectStatus { OPEN = 'Open', IN_PROGRESS = 'In Progress', FIXED = 'Fixed', RETEST = 'Retest', CLOSED = 'Closed', WONT_FIX = "Won't Fix", DUPLICATE = 'Duplicate' }

@Entity('defects')
export class Defect {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() title: string;
  @Column({ type: 'text' }) description: string;
  @Column({ type: 'text', nullable: true }) stepsToReproduce: string;
  @Column({ nullable: true }) expectedResult: string;
  @Column({ nullable: true }) actualResult: string;
  @Column({ type: 'enum', enum: DefectSeverity, default: DefectSeverity.MEDIUM }) severity: DefectSeverity;
  @Column({ type: 'enum', enum: DefectPriority, default: DefectPriority.P3 }) priority: DefectPriority;
  @Column({ type: 'enum', enum: DefectStatus, default: DefectStatus.OPEN }) status: DefectStatus;
  @Column({ nullable: true }) environment: string;
  @Column({ nullable: true }) buildVersion: string;
  @Column({ type: 'jsonb', default: [] }) attachments: string[];
  @Column({ nullable: true }) rootCause: string;
  @Column({ nullable: true }) suggestedFix: string;
  @Column({ type: 'jsonb', default: [] }) affectedRequirements: string[];
  @Column({ type: 'jsonb', default: [] }) affectedTestCases: string[];
  @Column({ nullable: true }) adoWorkItemId: string;
  @Column({ nullable: true }) jiraTicketId: string;
  @Column({ nullable: true }) serviceNowId: string;
  @ManyToOne(() => Project, { nullable: true }) project: Project;
  @Column({ nullable: true }) projectId: string;
  @ManyToOne(() => User, { nullable: true }) reporter: User;
  @Column({ nullable: true }) reporterId: string;
  @ManyToOne(() => User, { nullable: true }) assignee: User;
  @Column({ nullable: true }) assigneeId: string;
  @Column({ nullable: true }) resolvedAt: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
