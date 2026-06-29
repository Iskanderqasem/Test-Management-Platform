import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  LEAD = 'lead',
  TESTER = 'tester',
  DEVELOPER = 'developer',
  VIEWER = 'viewer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @ApiProperty({ example: 'uuid-v4', description: 'Unique user ID' })
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  @Column({ unique: true, length: 255 })
  email: string;

  @Exclude()
  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ enum: UserRole, example: UserRole.TESTER, description: 'User role' })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.TESTER,
  })
  role: UserRole;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'Avatar URL' })
  @Column({ nullable: true, length: 500 })
  avatar: string;

  @ApiPropertyOptional({ example: 'QA Team', description: 'Department or team' })
  @Column({ nullable: true, length: 100 })
  department: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  @Column({ nullable: true, name: 'phone_number', length: 20 })
  phoneNumber: string;

  @ApiPropertyOptional({ example: 'Senior QA Engineer', description: 'Job title' })
  @Column({ nullable: true, name: 'job_title', length: 100 })
  jobTitle: string;

  @ApiProperty({ example: true, description: 'Whether account is active' })
  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ default: false, name: 'is_locked' })
  isLocked: boolean;

  @Column({ default: false, name: 'email_verified' })
  emailVerified: boolean;

  @Column({ default: 0, name: 'failed_login_attempts' })
  failedLoginAttempts: number;

  @Column({ nullable: true, name: 'last_failed_login', type: 'timestamp' })
  lastFailedLogin: Date;

  @Column({ nullable: true, name: 'last_login_at', type: 'timestamp' })
  lastLoginAt: Date;

  @Column({ nullable: true, name: 'password_changed_at', type: 'timestamp' })
  passwordChangedAt: Date;

  @Column({ nullable: true, name: 'password_reset_token', length: 255 })
  @Exclude()
  passwordResetToken: string;

  @Column({ nullable: true, name: 'password_reset_expires', type: 'timestamp' })
  passwordResetExpires: Date;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  preferences: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  metadata: Record<string, any>;

  @ApiProperty({ description: 'Account creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
