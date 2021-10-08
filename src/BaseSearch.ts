
interface BaseSearchOptions {
  [key: string]: any
}

export interface IModuleSearch<T> {
  readonly options: T;

  search(needleWords: string[], haystackWords: string[]): void

  getScore(): number;
}

abstract class BaseSearch<T = BaseSearchOptions> implements IModuleSearch<T> {
  protected searchScore = 0;


  readonly options: T;

  constructor(options: T, defaultOptions: T) {
    this.options = {...options , ...defaultOptions};
  }

  search(needleWords: string[], haystackWords: string[]): void {
    throw new Error('search() should be implemented');
  }

  getScore(): number {
    throw new Error('getScore() should be implemented');
  }
}

export default BaseSearch;