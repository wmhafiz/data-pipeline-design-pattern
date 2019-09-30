import { EtlConfiguration, QueueFactory } from './factory';
import { Dispatcher, Processor, Writer, JobComplete } from './worker';

export class Etl<T> {
  protected dispatcher: Dispatcher<T>;
  protected processor: Processor<T>;
  protected writer: Writer<T>;
  protected jobComplete: JobComplete<T>;

  constructor(etlConfig: EtlConfiguration) {
    const inputQueue = QueueFactory.createQueue('input', etlConfig.queueOpts);
    const rawQueue = QueueFactory.createQueue('raw', etlConfig.queueOpts);
    const outputQueue = QueueFactory.createQueue('output', etlConfig.queueOpts);
    const jobCompleteQueue = QueueFactory.createQueue(
      'complete',
      etlConfig.queueOpts
    );

    this.dispatcher = new Dispatcher(
      etlConfig.readerOpts,
      inputQueue,
      rawQueue
    );
    this.processor = new Processor(
      etlConfig.processorOpts,
      inputQueue,
      outputQueue
    );
    this.writer = new Writer(etlConfig.writerOpts, outputQueue);
    this.jobComplete = new JobComplete(
      etlConfig.jobCompleteOpts,
      jobCompleteQueue
    );
  }

  execute() {
    if (process.env.TYPE === 'dispatcher') this.dispatcher.execute();
    if (process.env.TYPE === 'processor') this.processor.execute();
    if (process.env.TYPE === 'writer') this.writer.execute();
    if (process.env.TYPE === 'jobComplete') this.jobComplete.execute();
  }
}
