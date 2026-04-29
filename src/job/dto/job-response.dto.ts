import {
  JobStatus,
  ResponseStatus,
  JobLocationType,
  AppliedVia,
  InterviewType,
  JobPriority,
  JobSourceType,
  FollowUpStatus,
  FollowUpType,
  JobDocumentType,
  JobTimelineEventType,
} from '../domain/entities/job.entity';

// ================================
// Job Response DTO
// ================================

export class JobResponseDto {
  id: string;
  authId: string;

  // Company Info
  company: string;
  companyUrl?: string;
  companyLinkedin?: string;
  companyFacebook?: string;
  companyTwitter?: string;
  companyLogo?: string;

  // Role Info
  role: string;
  location: string;
  locationType: JobLocationType;

  // Salary
  salaryDisplay?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;

  // Contact
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;

  // Application
  appliedDate: Date;
  appliedVia: AppliedVia;
  jobPostingUrl?: string;
  status: JobStatus;
  responseStatus: ResponseStatus;
  responseDate?: Date;

  // Job Details
  techStack: string[];
  jobDescription?: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;

  // Interview
  interviewScheduled: boolean;
  interviewDate?: Date;
  interviewType?: InterviewType;
  interviewRound?: number;
  interviewLocation?: string;
  interviewNotes?: string;

  // Organization
  priority: JobPriority;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;

  // Offer
  offerAmount?: number;
  offerDate?: Date;
  offerDeadline?: Date;
  offerNotes?: string;

  // Rejection
  rejectionReason?: string;
  rejectionDate?: Date;

  // Notes
  notes?: string;

  // AI Fields
  aiParsedData?: Record<string, unknown>;
  aiConfidenceScore?: number;
  sourceType: JobSourceType;

  // Follow-up Tracking
  nextFollowUpDate?: Date;
  followUpCount: number;
  lastFollowUpDate?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Relations (when included)
  followUps?: JobFollowUpResponseDto[];
  jobNotes?: JobNoteResponseDto[];
  timeline?: JobTimelineEventResponseDto[];
  documents?: JobDocumentResponseDto[];
}

// ================================
// Follow-Up Response DTO
// ================================

export class JobFollowUpResponseDto {
  id: string;
  jobId: string;
  scheduledDate: Date;
  completedDate?: Date;
  status: FollowUpStatus;
  type: FollowUpType;
  subject?: string;
  message?: string;
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ================================
// Note Response DTO
// ================================

export class JobNoteResponseDto {
  id: string;
  jobId: string;
  title: string;
  content: string;
  isPinned: boolean;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ================================
// Timeline Event Response DTO
// ================================

export class JobTimelineEventResponseDto {
  id: string;
  jobId: string;
  eventType: JobTimelineEventType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// ================================
// Document Response DTO
// ================================

export class JobDocumentResponseDto {
  id: string;
  jobId: string;
  name: string;
  type: JobDocumentType;
  url?: string;
  mimeType?: string;
  size?: number;
  version: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ================================
// Paginated Response DTO
// ================================

export class PaginatedJobsResponseDto {
  data: JobResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ================================
// Job Statistics DTO (for analytics)
// ================================

export class JobStatisticsDto {
  totalJobs: number;
  byStatus: Record<JobStatus, number>;
  byResponseStatus: Record<ResponseStatus, number>;
  byLocationType: Record<JobLocationType, number>;
  byPriority: Record<JobPriority, number>;
  byAppliedVia: Record<AppliedVia, number>;

  // Analytics
  responseRate: number; // Percentage of jobs with responses
  interviewRate: number; // Percentage of jobs that got interviews
  offerRate: number; // Percentage of jobs that got offers

  // Trends
  applicationsThisWeek: number;
  applicationsThisMonth: number;
  responsesThisWeek: number;
  interviewsScheduled: number;

  // Averages
  averageResponseTime?: number; // Days between application and response
  averageSalaryMin?: number;
  averageSalaryMax?: number;
}
