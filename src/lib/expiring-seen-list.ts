export class ExpiringSeenList {
  private timeLimit: number;
  private seen: { [key: string]: boolean } = {};
  constructor(timeLimit: number) {
    this.timeLimit = timeLimit;
  }

  add(key: string): void {
    if (this.seen[key]) {
      return;
    }
    this.seen[key] = true;
    this.scheduleExpiry(key);
  }

  has(key: string): boolean {
    return Boolean(this.seen[key]);
  }

  private scheduleExpiry(key: string): void {
    setTimeout(() => {
      this.seen[key] = false;
    }, this.timeLimit);
  }
}
