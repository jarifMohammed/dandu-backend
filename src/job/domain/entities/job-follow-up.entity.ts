import { FollowUpStatus, FollowUpType } from './job.entity';

/**
 * JobFollowUp Domain Entity
 */
export class JobFollowUpEntity {
  constructor(
    public readonly id: string | null,
    public readonly jobId: string,
    public scheduledDate: Date,
    public completedDate: Date | null,
    public status: FollowUpStatus,
    public type: FollowUpType,
    public subject: string | null,
    public message: string | null,
    public response: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Mark this follow-up as completed.
   */
  complete(response?: string): void {
    this.status = 'COMPLETED';
    this.completedDate = new Date();
    if (response) {
      this.response = response;
    }
  }

  /**
   * Skip this follow-up.
   */
  skip(): void {
    this.status = 'SKIPPED';
  }

  get isPending(): boolean {
    return this.status === 'PENDING';
  }
}
