import { ReadStream } from "fs";

export interface Reader {
  read(): ReadStream;
}

export abstract class FileReader implements Reader {
  protected opts: FileReaderOpts;
  constructor(opts: FileReaderOpts) {
    this.opts = opts;
  }
  abstract read(): ReadStream;
}

export class FsFileReader extends FileReader {
  read(): ReadStream {
    throw new Error("Method not implemented");
  }
}

export interface FileReaderOpts {
  path: string;
  columns: string[];
}

export enum RdbmsType {
  MYSQL,
  MARIADB,
  POSTGRES,
  ORACLE,
  MSSQL,
  SQLLITE,
  SQLJS,
  MONGODB
}

export interface ServerConnection {
  host: string;
  port: number;
}

export interface EsReaderOptions {
  server: ServerConnection;
  index: string;
}

export interface RdbmsReaderOptions {
  dbType: RdbmsType;
  server: ServerConnection;
  username: string;
  password: string;
  database: string;
  table: string;
}

export abstract class RdbmsReader implements Reader {
  protected opts: RdbmsReaderOptions;
  constructor(opts: RdbmsReaderOptions) {
    this.opts = opts;
  }
  abstract read(): ReadStream;
}

export class TypeOrmReader extends RdbmsReader {
  read(): ReadStream {
    throw new Error("Method not implemented");
  }
}

export class EsReader implements Reader {
  protected opts: EsReaderOptions;
  constructor(opts: EsReaderOptions) {
    this.opts = opts;
  }
  read(): ReadStream {
    throw new Error("Method not implemented");
  }
}
