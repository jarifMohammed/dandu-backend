import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsEmail,
  IsEnum,
  IsArray,
  IsBoolean,
  IsNumber,
  IsDateString,
  Min,
  Max,
  IsObject,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  JobStatus,
  ResponseStatus,
  JobLocationType,
  AppliedVia,
  InterviewType,
  JobPriority,
  JobSourceType,
} from '../domain/entities/job.entity';

export class CreateJobDto {
  // ================================
  // Company Information
  // ================================

  @IsString()
  @IsNotEmpty({ message: 'Company name is required' })
  company: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid company URL format' })
  companyUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid LinkedIn URL format' })
  companyLinkedin?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid Facebook URL format' })
  companyFacebook?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid Twitter URL format' })
  companyTwitter?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid logo URL format' })
  companyLogo?: string;

  // ================================
  // Role Information
  // ================================

  @IsString()
  @IsNotEmpty({ message: 'Role/Position is required' })
  role: string;

  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @IsOptional()
  @IsEnum(JobLocationType, { message: 'Invalid location type' })
  locationType?: JobLocationType;

  // ================================
  // Salary Information
  // ================================

  @IsOptional()
  @IsString()
  salaryDisplay?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @IsOptional()
  @IsString()
  salaryCurrency?: string;

  // ================================
  // Contact Information
  // ================================

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid contact email format' })
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  // ================================
  // Application Details
  // ================================

  @IsDateString({}, { message: 'Invalid applied date format' })
  @IsNotEmpty({ message: 'Applied date is required' })
  appliedDate: string;

  @IsEnum(AppliedVia, { message: 'Invalid applied via value' })
  @IsNotEmpty({ message: 'Applied via is required' })
  appliedVia: AppliedVia;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid job posting URL format' })
  jobPostingUrl?: string;

  @IsOptional()
  @IsEnum(JobStatus, { message: 'Invalid job status' })
  status?: JobStatus;

  @IsOptional()
  @IsEnum(ResponseStatus, { message: 'Invalid response status' })
  responseStatus?: ResponseStatus;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid response date format' })
  responseDate?: string;

  // ================================
  // Job Details
  // ================================

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value) ? (value as string[]) : [],
  )
  techStack?: string[];

  @IsOptional()
  @IsString()
  jobDescription?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  responsibilities?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  // ================================
  // Interview Information
  // ================================

  @IsOptional()
  @IsBoolean()
  interviewScheduled?: boolean;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid interview date format' })
  interviewDate?: string;

  @IsOptional()
  @IsEnum(InterviewType, { message: 'Invalid interview type' })
  interviewType?: InterviewType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  interviewRound?: number;

  @IsOptional()
  @IsString()
  interviewLocation?: string;

  @IsOptional()
  @IsString()
  interviewNotes?: string;

  // ================================
  // Organization & Tracking
  // ================================

  @IsOptional()
  @IsEnum(JobPriority, { message: 'Invalid priority value' })
  priority?: JobPriority;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value) ? (value as string[]) : [],
  )
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  // ================================
  // Offer Details
  // ================================

  @IsOptional()
  @IsNumber()
  @Min(0)
  offerAmount?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid offer date format' })
  offerDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid offer deadline format' })
  offerDeadline?: string;

  @IsOptional()
  @IsString()
  offerNotes?: string;

  // ================================
  // Rejection Details
  // ================================

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid rejection date format' })
  rejectionDate?: string;

  // ================================
  // Notes
  // ================================

  @IsOptional()
  @IsString()
  notes?: string;

  // ================================
  // AI Integration Fields
  // ================================

  @IsOptional()
  @IsObject()
  aiParsedData?: Record<string, unknown>;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  aiConfidenceScore?: number;

  @IsOptional()
  @IsEnum(JobSourceType, { message: 'Invalid source type' })
  sourceType?: JobSourceType;

  @IsOptional()
  @IsString()
  rawJobPosting?: string;

  // ================================
  // Follow-up Tracking
  // ================================

  @IsOptional()
  @IsDateString({}, { message: 'Invalid next follow-up date format' })
  nextFollowUpDate?: string;
}
