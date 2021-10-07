class BaseModuleSearch {
    defaultOptions = {};
    lastSearchScore = 0;

    constructor(options) {
        this.options = {...this.defaultOptions, ...options};
    }
    search() {
        throw new Error('search() should be implemented');
    }

    getScore() {
        throw new Error('getScore() should be implemented');
    }
}

export default BaseModuleSearch;