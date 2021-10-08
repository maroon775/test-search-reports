import BaseSearch from "./BaseSearch";
import arraySumValues from "./libs/arraySumValues";
class MatchSearch extends BaseSearch {
    constructor() {
        super(...arguments);
        this.defaultOptions = {
            minNeedleWordLength: 2
        };
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
                else if (haystack.includes(needle)) {
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
