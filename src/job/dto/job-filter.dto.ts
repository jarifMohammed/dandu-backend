import {
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  JobStatus,
  ResponseStatus,
  JobLocationType,
  AppliedVia,
  JobPriority,
} from '../domain/entities/job.entity';

const parseCsv = (value: unknown): unknown => {
  if (typeof value === 'string') return value.split(',');
  return value;
};

export class JobFilterDto {
  // ================================
  // Search
  // ================================

  @IsOptional()
  @IsString()
  search?: string; // Search across company, role, techStack, location

  // ================================
  // Status Filters
  // ================================

  @IsOptional()
  @IsArray()
  @IsEnum(JobStatus, { each: true })
  @Transform(({ value }: { value: unknown }) => parseCsv(value))
  status?: JobStatus[];

  @IsOptional()
  @IsArray()
  @IsEnum(ResponseStatus, { each: true })
  @Transform(({ value }: { value: unknown }) => parseCsv(value))
  responseStatus?: ResponseStatus[];

  @IsOptional()
  @IsArray()
  @IsEnum(JobPriority, { each: true })
  @Transform(({ value }: { value: unknown }) => parseCsv(value))
  priority?: JobPriority[];

  // ================================
  // Location Filters
  // ================================

  @IsOptional()
  @IsArray()
  @IsEnum(JobLocationType, { each: true })
  @Transform(({ value }: { value: unknown }) => parseCsv(value))
  locationType?: JobLocationType[];

  @IsOptional()
  @IsString()
  location?: string;

  // ================================
  // Application Filters
  // ================================

  @IsOptional()
  @IsArray()
  @IsEnum(AppliedVia, { each: true })
  @Transform(({ value }: { value: unknown }) => parseCsv(value))
  appliedVia?: AppliedVia[];

  // ================================
  // Date Filters
  // ================================

  @IsOptional()
  @IsDateString()
  appliedDateFrom?: string;

  @IsOptional()
  @IsDateString()
  appliedDateTo?: string;

  @IsOptional()
  @IsDateString()
  responseDateFrom?: string;

  @IsOptional()
  @IsDateString()
  responseDateTo?: string;

  // ================================
  // Salary Filters
  // ================================

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salaryMinFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salaryMaxTo?: number;

  // ================================
  // Boolean Filters
  // ================================

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isArchived?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  interviewScheduled?: boolean;

  // ================================
  // Tag Filters
  // ================================

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }: { value: unknown }) => parseCsv(value))
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }: { value: unknown }) => parseCsv(value))
  techStack?: string[];

  // ================================
  // Company Filter
  // ================================

  @IsOptional()
  @IsString()
  company?: string;

  // ================================
  // Pagination
  // ================================

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  // ================================
  // Sorting
  // ================================

  @IsOptional()
  @IsString()
  sortBy?: string = 'appliedDate'; // appliedDate, company, status, salaryMax, responseDate, createdAt, priority

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
