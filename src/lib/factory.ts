import { Command } from "./command";
import { Queue } from "./queue";
import { Reader } from "./reader";

export interface ReaderOpts {
  type: string;
  opts: any;
}

export class ReaderFactory {
  static createReader(opts: ReaderOpts): Reader {
    throw new Error("Not implemented");
  }
}

export interface CommandOpts {
  title: string;
  cmd: string;
  opts: any;
}

export class CommandsFactory<T> {
  static createCommands(opts: Array<CommandOpts>): Array<Command<T>> {
    throw new Error("Not Implemented");
  }
}

export class HooksFactory<T> {
  static createHooks(opts: Array<CommandOpts>): Array<Command<T>> {
    throw new Error("Not Implemented");
  }
}

interface QueueOpts {
  type: string;
  opts: EtlOpts | any;
}

export class QueueFactory<T> {
  static createQueue(name: string, opts: QueueOpts): Queue<T> {
    throw new Error("Not Implemented");
  }
}

interface EtlOpts {
  /**
   * A boolean which, if true, removes the job when it successfully completes.
   * Default behavior is to keep the job in the completed set.
   */
  removeOnComplete?: boolean;

  /**
   * A boolean which, if true, removes the job when it fails after all attempts
   * Default behavior is to keep the job in the completed set.
   */
  removeOnFail?: boolean;

  /**
   * An amount of miliseconds to wait until this job can be processed.
   * Note that for accurate delays, both server and clients should have their clocks synchronized
   */
  delay?: number;

  /**
   * A number of attempts to retry if the job fails [optional]
   */
  attempts?: number;

  /**
   * Backoff setting for automatic retries if the job fails
   */
  backoff?: number | Backoff;

  /**
   * A boolean which, if true, adds the job to the right
   * of the queue instead of the left (default false)
   */
  lifo?: boolean;

  /**
   *  The number of milliseconds after which the job should be fail with a timeout error
   */
  timeout?: number;
}

export interface Backoff {
  /**
   * Backoff type, which can be either `fixed` or `exponential`
   */
  type: string;

  /**
   * Backoff delay, in milliseconds
   */
  delay: number;
}

export interface EtlConfiguration {
  id: number;
  title: string;
  description: string;
  queueOpts: QueueOpts;
  readerOpts: ReaderOpts;
  processorOpts: Array<CommandOpts>;
  writerOpts: Array<CommandOpts>;
  jobCompleteOpts: Array<CommandOpts>;
}
