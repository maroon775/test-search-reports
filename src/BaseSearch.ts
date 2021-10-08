
interface BaseSearchOptions {
  [key: string]: any
}

export interface IModuleSearch<T> {
  readonly options: T;
  readonly defaultOptions: T;

  search(needleWords: string[], haystackWords: string[]): void

  getScore(): number;
}

abstract class BaseSearch<T = BaseSearchOptions> implements IModuleSearch<T> {
  protected searchScore = 0;

  readonly defaultOptions: T = <T>{};

  readonly options: T;

  constructor(options: T) {
    this.options = { ...this.defaultOptions, ...options };
  }

  search(needleWords: string[], haystackWords: string[]) {
    throw new Error('search() should be implemented');
  }

  getScore(): number {
    throw new Error('getScore() should be implemented');
  }
}

export default BaseSearch;