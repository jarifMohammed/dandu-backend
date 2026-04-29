import { JobTimelineEventType } from './job.entity';

/**
 * JobTimelineEvent Domain Entity
 */
export class JobTimelineEventEntity {
  constructor(
    public readonly id: string | null,
    public readonly jobId: string,
    public readonly eventType: JobTimelineEventType,
    public readonly title: string,
    public readonly description: string | null,
    public readonly metadata: Record<string, unknown> | null,
    public readonly createdAt: Date,
  ) {}
}
