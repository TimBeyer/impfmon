export class ExpiringSeenList {
  private timeLimit: number;
  private seen: Set<string> = new Set();
  constructor(timeLimit: number) {
    this.timeLimit = timeLimit;
  }

  add(key: string): void {
    if (this.seen.has(key)) {
      return;
    }
    this.seen.add(key)
    this.scheduleExpiry(key);
  }

  has(key: string): boolean {
    return this.seen.has(key)
  }

  private scheduleExpiry(key: string): void {
    setTimeout(() => {
      this.seen.delete(key)
    }, this.timeLimit);
  }
}
