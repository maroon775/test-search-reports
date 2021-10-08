import BaseSearch from './BaseSearch';
import arraySumValues from './libs/arraySumValues';
class MatchSearch extends BaseSearch {
    constructor(options) {
        const defaultOptions = {
            minNeedleWordLength: 2,
        };
        super(options, defaultOptions);
    }
    getScore() {
        return this.searchScore;
    }
    search(needleWords, haystackWords) {
        const needleWordsFiltered = needleWords.filter(i => this.options.minNeedleWordLength <= i.length);
        const wordWeight = 1 / haystackWords.length;
        const scores = needleWordsFiltered.map(needle => {
            const needleScores = haystackWords.map((haystack) => {
                if (needle.trim() === haystack.trim()) {
                    return wordWeight;
                }
                if (haystack.includes(needle)) {
                    return wordWeight * (needle.length / haystack.length);
                }
                return 0;
            });
            return arraySumValues(needleScores);
        });
        this.searchScore = arraySumValues(scores);
    }
}
export default MatchSearch;
