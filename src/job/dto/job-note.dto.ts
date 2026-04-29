import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

// ================================
// Create Note DTO
// ================================

export class CreateJobNoteDto {
  @IsString()
  @IsNotEmpty({ message: 'Note title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Note content is required' })
  content: string;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @IsOptional()
  @IsString()
  category?: string;
}

// ================================
// Update Note DTO
// ================================

export class UpdateJobNoteDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @IsOptional()
  @IsString()
  category?: string;
}
