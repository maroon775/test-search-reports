import BaseSearch from './BaseSearch';
import levenshtein from './libs/levenshtein';
class LevenshteinSearch extends BaseSearch {
    constructor(options) {
        const defaultOptions = {
            minNeedleWordLength: 2,
            maxLevenshteinDistance: 3,
            levenshtein,
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
            const bestNeedleScore = [0];
            haystackWords.forEach(haystack => {
                const distance = this.options.levenshtein(needle, haystack);
                if (this.options.maxLevenshteinDistance < distance) {
                    return;
                }
                const maxLength = Math.max(needle.length, haystack.length);
                const score = ((maxLength - distance) / maxLength) * wordWeight;
                if (bestNeedleScore[0] < score) {
                    bestNeedleScore[0] = score;
                }
                else if (bestNeedleScore[0] === score) {
                    bestNeedleScore.push(score);
                }
            });
            return bestNeedleScore.reduce((a, b) => a + b, 0);
        });
        this.searchScore = scores.reduce((a, b) => a + b, 0);
    }
}
export default LevenshteinSearch;
