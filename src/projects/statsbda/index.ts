import { EtlConfiguration } from "../../lib/etl";
import { Trade } from "./models/trade";

const tradeRecord: Trade = {
  id: 1,
  name: "Telekom Malaysia Berhad",
  nameStd: "Telekom Malaysia Bhd",
  brn: "TM123",
  telNo: "0139485675",
  faxNo: "03223456",
  tradeValue: 100000,
  tradeDate: new Date(2015, 2, 13),
  coord: "103.1, 3.13",
  address: "Bangsar"
};

const msbrJob: EtlConfiguration<Trade> = {
  id: 1,
  title: "msbr job",
  description: "harmonize, SSM lookup & geocode msbr records",
  opts: {
    removeOnComplete: true,
    attempts: 20,
    backoff: {
      type: "exponential",
      delay: 10
    }
  },
  input: {
    dbType: "postgres",
    host: "localhost",
    database: "statsbda",
    username: "postgres",
    password: "tmgds20s",
    port: 4567,
    table: "tec_msbr_<mothYear:mmyyyy>"
  },
  processing: [
    {
      title: "Remove Invalid Characters",
      cmd: "remove/invalid",
      opts: {
        src: "buss_name",
        dest: "buss_name_cln"
      }
    },
    {
      title: "Standardize Company Names",
      cmd: "company/std",
      opts: {
        src: "buss_name",
        dest: "buss_name_std"
      }
    },
    {
      title: "Remove Company Generics",
      cmd: "company/generic",
      opts: {
        src: "buss_name",
        dest: "buss_name_nogeneric"
      }
    },
    {
      title: "Halal Lookup",
      cmd: "lookup",
      opts: {
        type: "match", // other options: 'term', 'matchPhrase'
        operation: "OR", // or 'AND'
        index: "lookup_halal_company",
        queries: [
          {
            src: "company_name",
            dest: "name"
          },
          {
            src: "business_reg_no",
            dest: "brn"
          }
        ],
        result: "result.length > 0"
      }
    }
  ],
  output: [
    {
      title: "Write back to the same DB",
      cmd: "DBWriter",
      opts: {
        index: "tec_msbr_<month:MMyyyy>",
        createTable: true,
        autoDrop: true,
        truncate: true,
        dbType: "postgres",
        host: "localhost",
        database: "statsbda",
        username: "postgres",
        password: "tmgds20s",
        port: 4567
      }
    },
    {
      title: "Index into the search engine",
      cmd: "ESWriter",
      opts: {
        index: "tec_msbr_<month:MMyyyy>",
        deleteIndex: true,
        createMapper: true,
        host: "localhost",
        username: "postgres",
        password: "tmgds20s"
      }
    }
  ],
  jobComplete: [
    {
      title: "Two Way Traders",
      cmd: "aggregate",
      opts: {
        fields: ["trade_type"],
        index: "tec_msbr_<monthYear: MMyyyy>",
        result: "result.length === 1"
      }
    },
    {
      title: "Agent Flag",
      cmd: "lookup",
      opts: {
        type: "match",
        operation: "OR",
        index: "lookup_agent",
        queries: [
          {
            src: "company_name",
            dest: "name"
          },
          {
            src: "business_reg_no",
            dest: "brn"
          }
        ],
        result: "result.length > 1"
      }
    },
    {
      title: "Generate Data Quality Reports",
      cmd: "DataQualityGenerator",
      opts: {
        jobId: "this.id"
      }
    },
    {
      title: "Generate Control Figure Reports",
      cmd: "ControlFigureGenerator",
      opts: {
        jobId: "this.id"
      }
    },
    {
      title: "Send Email",
      cmd: "EmailSender",
      opts: {
        subject: "MSBR Job Completed at <now:dd/MM/yyyy:mm:ss>",
        body: ""
      }
    }
  ]
};
