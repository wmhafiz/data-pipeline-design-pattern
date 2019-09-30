import { Queue } from 'bull';
import { ReaderOpts, CommandsOpts, JobCompleteHook } from './worker';

interface EtlOptions {
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
  queue: Queue<T>;
  opts: EtlOptions;
  input: ReaderOpts;
  output: CommandsOpts;
  processing: CommandsOpts;
  jobComplete: JobCompleteHook[];
}

interface Trade {
  id: number;
  name: string;
  brn: string;
  telNo: string;
  faxNo: string;
  coord: string;
  address: string;
}

const tradeRecords: Trade[] = [
  {
    id: 1,
    name: 'Telekom Malaysia Berhad',
    brn: 'TM123',
    telNo: '0139485675',
    faxNo: '03223456',
    coord: '103.1, 3.13',
    address: 'Bangsar',
  },
  {
    id: 2,
    name: 'Celcom Sdn Berhad',
    brn: 'TM123',
    telNo: '0139485675',
    faxNo: '03223456',
    coord: '103.1, 3.13',
    address: 'KL',
  },
  {
    id: 3,
    name: 'Maxis Sdn Berhad',
    brn: 'TM123',
    telNo: '0139485675',
    faxNo: '03223456',
    coord: '103.1, 3.13',
    address: 'Damansara',
  },
];

interface Msbr {
  ID: number;
  name: string;
  brn: string;
  telNo: string;
  faxNo: string;
  coord: string;
  address: string;
}
