type BaseSearchOptions = Record<string, any>;
type BaseSearchDefaultOptions = BaseSearchOptions;

export interface IModuleSearch<T, S> {
  readonly options:  S | (T & S) | Record<string, any>;

  search(needleWords: string[], haystackWords: string[]): void

  getScore(): number;
}

abstract class BaseSearch<T = BaseSearchOptions, S = BaseSearchDefaultOptions> implements IModuleSearch<T, S> {
  protected searchScore = 0;

  readonly options: S | (T & S) | Record<string, any>;

  protected constructor(options: T, defaultOptions: S) {
    this.options = {...(defaultOptions || {}), ...(options || {})};
  }

  search(needleWords: string[], haystackWords: string[]): void {
    throw new Error('search() should be implemented');
  }

  getScore(): number {
    throw new Error('getScore() should be implemented');
  }
}

export default BaseSearch;