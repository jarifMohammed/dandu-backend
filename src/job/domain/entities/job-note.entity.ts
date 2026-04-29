/**
 * JobNote Domain Entity
 */
export class JobNoteEntity {
  constructor(
    public readonly id: string | null,
    public readonly jobId: string,
    public title: string,
    public content: string,
    public isPinned: boolean,
    public category: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Toggle the pin status of this note.
   */
  togglePin(): boolean {
    this.isPinned = !this.isPinned;
    return this.isPinned;
  }
}
