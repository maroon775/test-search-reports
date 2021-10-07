import BaseModuleSearch from "./BaseModuleSearch.js";
import levenshtein from "./libs/levenshtein.js";

class LevenshteinSearch extends BaseModuleSearch {
    defaultOptions = {
        minNeedleWordLength: 2,
        maxLevenshteinDistance: 3,
    }
    search(needleWords, haystackWords) {
        const needleWordsFiltered = needleWords.filter(i => this.options.minNeedleWordLength <= i.length);
        const wordWeight = 1/haystackWords.length;

        const scores = needleWordsFiltered.map(needle => {
            let bestNeedleScore = [0];

            for (let i = 0, l = haystackWords.length; i < l; i++) {
                const haystack = haystackWords[i];

                const distance = levenshtein(needle, haystack);
                if (this.options.maxLevenshteinDistance < distance) {
                    continue;
                }
                const maxlen = Math.max(needle.length, haystack.length);

                const score = ((maxlen - distance) / maxlen) * wordWeight;
                if (bestNeedleScore[0] < score) {
                    bestNeedleScore[0] = score
                } else if (bestNeedleScore[0] === score) {
                    bestNeedleScore.push(score);
                }
            }

            return bestNeedleScore.reduce((a, b) => a + b, 0);
        });


        this.lastSearchScore = scores.reduce((a, b) => a + b, 0);
    }

    getScore() {
        return this.lastSearchScore;
    }
}

export default LevenshteinSearch