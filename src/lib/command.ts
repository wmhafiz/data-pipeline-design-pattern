export interface Command<T> {
  execute(data: T): T;
}

export enum TextReplacerType {
  Exact,
  Word,
  Special,
}

export interface Dictionary {
  entries: Array<DictionaryEntry>;
}

export interface DictionaryEntry {
  key1: string;
  key2: string;
  type: TextReplacerType;
}

export enum MatchingAlgo {
  LEVENSHTEIN,
  JARO_WRINKLER,
}

export interface GeocodeOpts {
  tresholds: number;
  matchingAlgo: MatchingAlgo;
}

export class Geocode<T> implements Command<T> {
  opts: GeocodeOpts;
  execute(data: T): T {
    throw new Error('Method not implemented.');
  }
}

export abstract class Standardize<T> implements Command<T> {
  protected dictionary: Dictionary;
  abstract getDictionaryName(): string;
  getDictionary(): Dictionary {
    throw new Error('Not Implemented');
  }
  execute(data: T): T {
    throw new Error('Not Implemented');
  }
}

export class StandardizeCompany extends Standardize<T> {
  getDictionaryName(): string {
    return 'dictionary_company';
  }
}

export class StandardizeAddressCity extends Standardize<T> {
  getDictionaryName(): string {
    return 'dictionary_address_city';
  }
}

export enum LookupType {
  MATCH,
  TERM,
  MATCH_PHRASE,
}

export enum OperationType {
  OR,
  AND,
}

export interface KeyValue {
  key: string;
  value: string;
}

export interface LookupOpts {
  type: LookupType;
  operation: OperationType;
  index: string;
  queries: Array<KeyValue>;
}

export abstract class Lookup<T> implements Command<T> {
  protected opts: LookupOpts;
  abstract _setLookupOpts(data: T): LookupOpts;
  abstract _parseResult(result: object[]): T;
  _lookup(opts: LookupOpts): object[] {
    throw new Error('Not Imeplemented');
  }
  execute(data: T): T {
    const opts = this._setLookupOpts(data);
    const result = this._lookup(opts);
    return this._parseResult(result);
  }
}

export class HalalCompanyLookup<T> extends Lookup<T> {
  constructor(protected nameField: string, protected brnField: string) {
    super();
  }
  _parseResult(result: object[]): T {
    throw new Error('Method not implemented.');
  }

  _setLookupOpts(data: T): LookupOpts {
    return {
      type: LookupType.MATCH,
      operation: OperationType.AND,
      index: 'lookup_halal_company',
      queries: [
        {
          key: 'company_name',
          value: data[this.nameField],
        },
        {
          key: 'brn',
          value: data[this.brnField],
        },
      ],
    };
  }
}

export class AgentLookup<T> extends Lookup<T> {
  _setLookupOpts(data: T): LookupOpts {
    throw new Error('Method not implemented.');
  }
  _parseResult(result: object[]): T {
    throw new Error('Method not implemented.');
  }
}
