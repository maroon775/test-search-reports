class BaseSearch {
    constructor(options) {
        this.searchScore = 0;
        this.defaultOptions = {};
        this.options = Object.assign(Object.assign({}, this.defaultOptions), options);
    }
    search(needleWords, haystackWords) {
        throw new Error('search() should be implemented');
    }
    getScore() {
        throw new Error('getScore() should be implemented');
    }
}
export default BaseSearch;
