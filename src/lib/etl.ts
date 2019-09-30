import { EtlConfiguration, QueueFactory } from "./factory";
import { Dispatcher, Processor, Writer, JobComplete } from "./worker";

export class Etl<T> {
  protected dispatcher: Dispatcher<T>;
  protected processor: Processor<T>;
  protected writer: Writer<T>;
  protected jobCompleteHooks: JobComplete<T>;

  constructor(etlConfig: EtlConfiguration) {
    const inputQueue = QueueFactory.createQueue("input", etlConfig.queueOpts);
    const rawQueue = QueueFactory.createQueue("raw", etlConfig.queueOpts);
    const outputQueue = QueueFactory.createQueue("output", etlConfig.queueOpts);
    const jobCompleteQueue = QueueFactory.createQueue(
      "complete",
      etlConfig.queueOpts
    );

    this.dispatcher = new Dispatcher(etlConfig.input, inputQueue, rawQueue);
    this.processor = new Processor(
      etlConfig.processing,
      inputQueue,
      outputQueue
    );
    this.writer = new Writer(etlConfig.output, outputQueue);
    this.jobCompleteHooks = new JobComplete(
      etlConfig.jobComplete,
      jobCompleteQueue
    );
  }
}
