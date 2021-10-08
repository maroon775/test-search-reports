class BaseSearch {
    constructor(options, defaultOptions) {
        this.searchScore = 0;
        this.options = Object.assign(Object.assign({}, options), defaultOptions);
    }
    search(needleWords, haystackWords) {
        throw new Error('search() should be implemented');
    }
    getScore() {
        throw new Error('getScore() should be implemented');
    }
}
export default BaseSearch;
