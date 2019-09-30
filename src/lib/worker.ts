import {
  CommandOpts,
  CommandsFactory,
  HooksFactory,
  ReaderFactory,
  ReaderOpts
} from "./factory";
import { Queue } from "./queue";

export class Dispatcher<T> {
  protected readerOpts: ReaderOpts;
  protected inputQueue: Queue<T>;
  protected rawQueue: Queue<T>;

  constructor(
    readerOpts: ReaderOpts,
    inputQueue: Queue<T>,
    rawQueue: Queue<T>
  ) {
    this.readerOpts = readerOpts;
    this.inputQueue = inputQueue;
    this.rawQueue = rawQueue;
  }

  execute(): void {
    this.inputQueue.on("data", readerOpts => {
      const reader = ReaderFactory.createReader(readerOpts);
      const readStream = reader.read();
      readStream.on("data", data => {
        this.rawQueue.add(data);
      });
    });
  }
}

export class Processor<T> {
  protected inputQueue: Queue<T>;
  protected outputQueue: Queue<T>;
  protected commandsOptions: Array<CommandOpts>;

  constructor(
    commandsOptions: Array<CommandOpts>,
    inputQueue: Queue<T>,
    outputQueue: Queue<T>
  ) {
    this.commandsOptions = commandsOptions;
    this.inputQueue = inputQueue;
    this.outputQueue = outputQueue;
  }

  execute(): void {
    const commands = CommandsFactory.createCommands(this.commandsOptions);
    this.inputQueue.on("data", data => {
      let output = data;
      commands.forEach(command => {
        const result = command.execute(data);
        output = {
          ...output,
          ...result
        };
      });
      this.outputQueue.add(output);
    });
  }
}

export class Writer<T> {
  protected outputQueue: Queue<T>;
  protected commandsOptions: Array<CommandOpts>;

  constructor(commandsOptions: Array<CommandOpts>, outputQueue: Queue<T>) {
    this.commandsOptions = commandsOptions;
    this.outputQueue = outputQueue;
  }

  execute(): void {
    const commands = CommandsFactory.createCommands(this.commandsOptions);
    this.outputQueue.on("data", (data: T) => {
      let output = data;
      commands.forEach(async command => {
        const result = await command.execute(data);
        output = {
          ...data,
          ...result
        };
      });
      this.outputQueue.add(output);
    });
  }
}

export class JobComplete<T> {
  protected jobCompleteQueue: Queue<T>;
  protected hooksOpts: Array<CommandOpts>;

  constructor(hooksOpts: Array<CommandOpts>, jobCompleteQueue: Queue<T>) {
    this.hooksOpts = hooksOpts;
    this.jobCompleteQueue = jobCompleteQueue;
  }

  execute(): void {
    this.jobCompleteQueue.on("data", data => {
      const hooks = HooksFactory.createHooks(this.hooksOpts);
      hooks.forEach(hook => {
        hook.execute(data);
      });
    });
  }
}
