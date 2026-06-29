import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';

export enum TestCaseStatus { NOT_RUN = 'Not Run', PASS = 'Pass', FAIL = 'Fail', BLOCKED = 'Blocked', SKIPPED = 'Skipped', RETEST = 'Retest' }
export enum TestCasePriority { CRITICAL = 'Critical', HIGH = 'High', MEDIUM = 'Medium', LOW = 'Low' }
export enum TestCaseType { FUNCTIONAL = 'Functional', NEGATIVE = 'Negative', BOUNDARY = 'Boundary', PERFORMANCE = 'Performance', SECURITY = 'Security', REGRESSION = 'Regression', SMOKE = 'Smoke', UAT = 'UAT', PVT = 'PVT', ACCESSIBILITY = 'Accessibility', EXPLORATORY = 'Exploratory', INTEGRATION = 'Integration' }

@Entity('test_cases')
export class TestCase {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() title: string;
  @Column({ nullable: true }) description: string;
  @Column({ type: 'enum', enum: TestCasePriority, default: TestCasePriority.MEDIUM }) priority: TestCasePriority;
  @Column({ type: 'enum', enum: TestCaseType, default: TestCaseType.FUNCTIONAL }) type: TestCaseType;
  @Column({ type: 'enum', enum: TestCaseStatus, default: TestCaseStatus.NOT_RUN }) status: TestCaseStatus;
  @Column({ nullable: true }) preconditions: string;
  @Column({ type: 'jsonb', default: [] }) testData: string[];
  @Column({ type: 'jsonb', default: [] }) steps: { stepNumber: number; action: string; expectedResult: string }[];
  @Column({ nullable: true }) expectedResult: string;
  @Column({ nullable: true }) actualResult: string;
  @Column({ default: false }) automationFlag: boolean;
  @Column({ nullable: true }) requirementId: string;
  @Column({ nullable: true }) sprint: string;
  @Column({ nullable: true }) module: string;
  @Column({ nullable: true }) environment: string;
  @Column({ nullable: true }) riskLevel: string;
  @Column({ nullable: true }) estimatedDuration: number;
  @Column({ type: 'jsonb', default: [] }) evidence: string[];
  @Column({ type: 'jsonb', default: [] }) tags: string[];
  @ManyToOne(() => Project, { nullable: true }) project: Project;
  @Column({ nullable: true }) projectId: string;
  @ManyToOne(() => User, { nullable: true }) owner: User;
  @Column({ nullable: true }) ownerId: string;
  @Column({ default: false }) isAiGenerated: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
