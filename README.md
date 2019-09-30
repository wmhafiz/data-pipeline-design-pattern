# Data Pipeline Design Patterns

## Reader

Reader is used by Dispatcher worker to get Raw data into the queue.

Reader interface has a single Read method that will return a Readstream.

``` typescript
export interface Reader {
  read(): ReadStream;
}
```

Concrete classes include: `FileReader`, `RdbmsReader`, `EsReader`

![Reader class diagram](images/reader-class-diagram.svg)

## Command

Command is used by Processor & Writer to perform data transformation & data loading to another destination.

Command interface has a single `execute` method that will take a generic type instace and return the back type instace

``` typescript
export interface Command<T> {
  execute(data: T): T;
}
```

Concrete classes include: `Geocode`, `StandardizeCompanyName`, `HalalCompanyLookup`, `StandardizeAddressCity`

![Command class diagram](images/command-class-diagram.svg)

## Queue

Queue is responsible to publish jobs to workers that subscribed to the queues

Queue interface has `add`, `empty` and `on` methods.

![Queue interface](images/queue-interface.png)

Concrete classes include: `BullQueue` & `RabbitMqQueue`. Since BullQueue has advanced functionality, it also implements QueuePausable & QueueIndexable interface, while RabbitMqQueue does not.

![Queue interface](images/queue-class-diagram.svg)

## Workers

![Worker class diagram](images/worker-class-diagram.svg)

There are 4 type of workers:

- Dispatcher: read data from a data source and publish it into Raw Queue
- Processor: subscribe to Raw Queue and perform data transformation & publish it to Output Queue
- Writer: subscribe to Output Queue and load it to various data sources
- JobComplete: subscribe to Job Complete Queue and perform custom business logics

![Worker snippets](images/worker-snippet.png)

Example hooks:

- Generate Control Figure & Data Quality reports
- Sending email notifications

## Use Cases

### StatsBDA Automation

![StatsBDA Data Flow](images/StatsBDA_Automation_Data_Flow.png)

Example job configuration:

``` typescript
const msbrJob: JobConfiguration = {
  id: 1,
  title: 'msbr job',
  description: 'harmonize, SSM lookup & geocode msbr records',
  input: {
    dbType: 'postgres',
    host: 'localhost',
    database: 'statsbda',
    username: 'postgres',
    password: 'tmgds20s',
    port: 4567,
    table: 'tec_msbr_<mothYear:mmyyyy>'
  },
  processing: [
    {
      title: 'Remove Invalid Characters',
      cmd: 'remove/invalid',
      opts: {
        src: 'buss_name',
        dest: 'buss_name_cln'
      }
    },
    {
      title: 'Standardize Company Names',
      cmd: 'company/std',
      opts: {
        src: 'buss_name',
        dest: 'buss_name_std'
      }
    },
    {
      title: 'Remove Company Generics',
      cmd: 'company/generic',
      opts: {
        src: 'buss_name',
        dest: 'buss_name_nogeneric'
      }
    },
    {
      title: 'Halal Lookup',
      cmd: 'lookup',
      opts: {
        type: 'match', // other options: 'term', 'matchPhrase'
        operation: 'OR', // or 'AND'
        index: 'lookup_halal_company',
        queries: [
          {
            src: 'company_name',
            dest: 'name'
          },
          {
            src: 'business_reg_no',
            dest: 'brn'
          }
        ],
        result: 'result.length > 0'
      }
    }
  ],
  output: [
    {
      title: 'Write back to the same DB',
      cmd: 'DBWriter',
      opts: {
        index: 'tec_msbr_<month:MMyyyy>',
        createTable: true,
        autoDrop: true,
        truncate: true,
        dbType: 'postgres',
        host: 'localhost',
        database: 'statsbda',
        username: 'postgres',
        password: 'tmgds20s',
        port: 4567
      }
    },
    {
      title: 'Index into the search engine',
      cmd: 'ESWriter',
      opts: {
        index: 'tec_msbr_<month:MMyyyy>',
        deleteIndex: true,
        createMapper: true,
        host: 'localhost',
        username: 'postgres',
        password: 'tmgds20s'
      }
    }
  ],
  jobComplete: [
    {
      title: 'Two Way Traders',
      cmd: 'aggregate',
      opts: {
        fields: ['trade_type'],
        index: 'tec_msbr_<monthYear: MMyyyy>',
        result: 'result.length === 1'
      }
    },
    {
      title: 'Agent Flag',
      cmd: 'lookup',
      opts: {
        type: 'match',
        operation: 'OR',
        index: 'lookup_agent',
        queries: [
          {
            src: 'company_name',
            dest: 'name'
          },
          {
            src: 'business_reg_no',
            dest: 'brn'
          }
        ],
        result: 'result.length > 1'
      }
    },
    {
      title: 'Generate Data Quality Reports',
      cmd: 'DataQualityGenerator',
      opts: {
        jobId: 'this.id'
      }
    },
    {
      title: 'Generate Control Figure Reports',
      cmd: 'ControlFigureGenerator',
      opts: {
        jobId: 'this.id'
      }
    },
    {
      title: 'Send Email',
      cmd: 'EmailSender',
      opts: {
        subject: 'MSBR Job Completed at <now:dd/MM/yyyy:mm:ss>',
        body: ''
      }
    }
  ]
};
```