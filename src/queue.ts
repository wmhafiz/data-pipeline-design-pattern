import { QueueOptions } from "bull";

export interface Job<T> {
  jobId: string;
  data: T;
}

export interface Queue<T> {
  /**
   * Creates a new job and adds it to the queue.
   * If the queue is empty the job will be executed directly,
   * otherwise it will be placed in the queue and executed as soon as possible.
   */
  add(data: T): Promise<Job<T>>;

  /**
   * Consumes the queue to get the data
   */
  on(event: string, cb: (data: T) => void): void;

  /**
   * Empties a queue deleting all the input lists and associated jobs.
   */
  empty(): Promise<void>;
}

export interface QueuePausable {
  /**
   * Returns a promise that resolves when the queue is paused.
   * The pause is global, meaning that all workers in all queue instances for a given queue will be paused.
   * A paused queue will not process new jobs until resumed,
   * but current jobs being processed will continue until they are finalized.
   *
   * Pausing a queue that is already paused does nothing.
   */
  pause(): Promise<void>;

  /**
   * Returns a promise that resolves when the queue is resumed after being paused.
   * The resume is global, meaning that all workers in all queue instances for a given queue will be resumed.
   *
   * Resuming a queue that is not paused does nothing.
   */
  resume(): Promise<void>;
}

export interface QueueIndexable {
  /**
   * Returns a promise that returns the number of jobs in the queue, waiting or paused.
   * Since there may be other processes adding or processing jobs, this value may be true only for a very small amount of time.
   */
  count(): Promise<number>;

  /**
   * Returns a promise that will return the job instance associated with the jobId parameter.
   * If the specified job cannot be located, the promise callback parameter will be set to null.
   */
  getJob(jobId: string): Promise<Job | null>;
}

export class BullQueue<T> implements Queue<T>, QueuePausable, QueueIndexable {
  protected job: Job<T>;
  constructor(protected name: string, protected opts?: QueueOptions) {}
  add(data: T): Promise<Job<T>> {
    throw new Error("Method not implemented.");
  }
  on(event: string, cb: (data: T) => void): void {
    throw new Error("Method not implemented.");
  }
  count(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  empty(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getJob(jobId: string): Promise<Job<T> | null> {
    throw new Error("Method not implemented.");
  }
  pause(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  resume(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export class RabbitMqQueue<T> implements Queue<T> {
  protected job: Job<T>;
  add(data: T): Promise<Job<T>> {
    throw new Error("Method not implemented.");
  }
  on(event: string, cb: (data: T) => void): void {
    throw new Error("Method not implemented.");
  }
  empty(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
