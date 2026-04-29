import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsOptional, IsNumber, IsDateString, Min } from 'class-validator';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  // Additional fields that might be updated but not in create

  @IsOptional()
  @IsNumber()
  @Min(0)
  followUpCount?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid last follow-up date format' })
  lastFollowUpDate?: string;
}
