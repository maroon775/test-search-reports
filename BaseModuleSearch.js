class BaseModuleSearch {
    options = {};
    lastSearchScore = 0;

    constructor(options) {
        this.options = options;
    }
    search() {
        return new Error('search() should be implemented')
    }

    getScore() {
        return new Error('getScore() should be implemented')
    }
}

export default BaseModuleSearch;