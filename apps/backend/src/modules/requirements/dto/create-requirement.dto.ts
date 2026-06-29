import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsArray,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequirementType, RequirementStatus, RequirementPriority } from '../requirement.entity';

export class CreateRequirementDto {
  @ApiProperty({ example: 'REQ-001', description: 'Requirement identifier' })
  @IsString()
  @MaxLength(50)
  reqId: string;

  @ApiProperty({ example: 'User must be able to log in with email and password' })
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  title: string;

  @ApiPropertyOptional({ description: 'Detailed description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: RequirementType, default: RequirementType.FUNCTIONAL })
  @IsOptional()
  @IsEnum(RequirementType)
  type?: RequirementType;

  @ApiPropertyOptional({ enum: RequirementStatus })
  @IsOptional()
  @IsEnum(RequirementStatus)
  status?: RequirementStatus;

  @ApiPropertyOptional({ enum: RequirementPriority })
  @IsOptional()
  @IsEnum(RequirementPriority)
  priority?: RequirementPriority;

  @ApiPropertyOptional({ description: 'Acceptance criteria' })
  @IsOptional()
  @IsString()
  acceptanceCriteria?: string;

  @ApiPropertyOptional({ description: 'Source document name' })
  @IsOptional()
  @IsString()
  sourceDocument?: string;

  @ApiPropertyOptional({ description: 'Source reference (page/section)' })
  @IsOptional()
  @IsString()
  sourceReference?: string;

  @ApiPropertyOptional({ description: 'Parent requirement UUID' })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({ description: 'External system ID' })
  @IsOptional()
  @IsString()
  externalId?: string;

  @ApiPropertyOptional({ description: 'Tags/labels' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'Project ID' })
  @IsUUID()
  projectId: string;
}

export class UpdateRequirementDto {
  @IsOptional() @IsString() @MinLength(5) @MaxLength(500) title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(RequirementType) type?: RequirementType;
  @IsOptional() @IsEnum(RequirementStatus) status?: RequirementStatus;
  @IsOptional() @IsEnum(RequirementPriority) priority?: RequirementPriority;
  @IsOptional() @IsString() acceptanceCriteria?: string;
  @IsOptional() @IsString() sourceDocument?: string;
  @IsOptional() @IsString() externalId?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
}

export class UploadRequirementsDto {
  @ApiProperty({ description: 'Project ID to associate requirements with' })
  @IsUUID()
  projectId: string;

  @ApiPropertyOptional({ description: 'Source document name' })
  @IsOptional()
  @IsString()
  sourceDocument?: string;
}
