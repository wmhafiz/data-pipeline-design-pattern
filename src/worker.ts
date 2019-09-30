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

export class Dispatcher<T> {
  protected readerOpts: ReaderOpts;
  protected inputQueue: Queue<ReaderOpts>;
  protected rawQueue: Queue<T>;

  constructor(
    readerOpts: ReaderOpts,
    inputQueue: Queue<ReaderOpts>,
    rawQueue: Queue<T>
  ) {
    this.readerOpts = readerOpts;
    this.inputQueue = inputQueue;
    this.rawQueue = rawQueue;
    this.dispatch();
  }

  dispatch(): void {
    this.inputQueue.on("data", readerOpts => {
      const reader = ReaderFactory.createReader(readerOpts);
      const readStream = reader.read();
      readStream.on("data", data => {
        this.rawQueue.add(data);
      });
    });
  }
}

export interface CommandsOpts {
  commands: Array<CommandOpts>;
}

export interface CommandOpts {
  name: string;
  opts: any;
}

export class CommandsFactory<T> {
  static createCommand(opts: CommandsOpts): Array<Command<T>> {
    throw new Error("Not Implemented");
  }
}

export class Processor<T> {
  protected inputQueue: Queue<T>;
  protected processQueue: Queue<T>;
  protected command: Command<T>;

  constructor(
    command: Command<T>,
    inputQueue: Queue<T>,
    processQueue: Queue<T>
  ) {
    this.command = command;
    this.inputQueue = inputQueue;
    this.processQueue = processQueue;
  }

  process(): void {
    this.inputQueue.on("data", data => {
      const result = this.command.execute(data);
      this.processQueue.add(result);
    });
  }
}

export class Writer<T> {
  protected processQueue: Queue<T>;
  protected outputQueue: Queue<T>;
  protected commands: Array<Command<T>>;

  constructor(
    commands: Array<Command<T>>,
    outputQueue: Queue<T>,
    processQueue: Queue<T>
  ) {
    this.commands = commands;
    this.processQueue = processQueue;
    this.outputQueue = outputQueue;
  }

  process(): void {
    this.processQueue.on("data", (data: T) => {
      this.commands.forEach(async command => {
        const result = await command.execute(data);
        data = {
          ...data,
          ...result
        };
      });
    });
    this.outputQueue.add(result);
  }
}

export interface JobCompleteHook<T> {
  execute(data: T[]): void;
}

export class JobComplete<T> {
  protected outputQueue: Queue<T>;
  protected hook: JobCompleteHook<T>;

  constructor(hook: JobCompleteHook<T>, outputQueue: Queue<T>) {
    this.hook = hook;
    this.outputQueue = outputQueue;
  }

  process(data: T): T {
    this.outputQueue.on("data", data => {
      const result = this.hook.execute(data);
      this.outputQueue.add(result);
    });
  }
}
