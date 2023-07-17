export type Task = () => Promise<any>;

export class AsyncQueue {
  private queue: Array<Task> = [];
  private activeTaskCount: number = 0;
  private results: any[] = [];
  private concurrency: number;

  constructor(concurrency: number) {
    this.concurrency = concurrency;
  }

  public addTask(task: Task | Array<Task>): void {
    if (Array.isArray(task)) {
      this.queue.push(...task);
    } else {
      this.queue.push(task);
    }
    if (this.activeTaskCount < this.concurrency && this.queue.length > 0) {
      this.runTasks();
    }
  }

  private async runTasks(): Promise<void> {
    while (this.queue.length > 0 && this.activeTaskCount < this.concurrency) {
      const waitTasks = this.queue.splice(0, this.concurrency - this.activeTaskCount);
      this.activeTaskCount = waitTasks.length;
      const results = await Promise.allSettled(waitTasks.map((task) => task()));
      this.results.push(...results);
      this.activeTaskCount -= results.length;
    }
  }
}
