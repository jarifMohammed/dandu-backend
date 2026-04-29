import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { FollowUpStatus, FollowUpType } from '../domain/entities/job.entity';

// ================================
// Create Follow-Up DTO
// ================================

export class CreateJobFollowUpDto {
  @IsDateString({}, { message: 'Invalid scheduled date format' })
  @IsNotEmpty({ message: 'Scheduled date is required' })
  scheduledDate: string;

  @IsEnum(FollowUpType, { message: 'Invalid follow-up type' })
  @IsNotEmpty({ message: 'Follow-up type is required' })
  type: FollowUpType;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  message?: string;
}

// ================================
// Update Follow-Up DTO
// ================================

export class UpdateJobFollowUpDto {
  @IsOptional()
  @IsDateString({}, { message: 'Invalid scheduled date format' })
  scheduledDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid completed date format' })
  completedDate?: string;

  @IsOptional()
  @IsEnum(FollowUpStatus, { message: 'Invalid follow-up status' })
  status?: FollowUpStatus;

  @IsOptional()
  @IsEnum(FollowUpType, { message: 'Invalid follow-up type' })
  type?: FollowUpType;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  response?: string;
}

// ================================
// Complete Follow-Up DTO
// ================================

export class CompleteJobFollowUpDto {
  @IsOptional()
  @IsString()
  response?: string;

  @IsOptional()
  @IsEnum(FollowUpStatus, { message: 'Invalid follow-up status' })
  status?: FollowUpStatus;
}
