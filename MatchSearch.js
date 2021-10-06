import BaseModuleSearch from "./BaseModuleSearch.js";


class MatchSearch extends BaseModuleSearch {
    options = {
        minNeedleWordLength: 2
    }
    getScore() {
        return this.lastSearchScore;
    }
    search(needleWords, haystackWords) {
        const needleWordsFiltered = needleWords.filter(i => this.options.minNeedleWordLength <= i.length);
        // const wordWeight = 1/haystackWords.length;
        const wordWeight = 1/needleWords.length;


        const scores = needleWordsFiltered.map(needle => {
            const needleScores = haystackWords.map((haystack) => {
                if (needle.trim() === haystack.trim()) {
                    return wordWeight;
                } else if (haystack.includes(needle)) {
                    return wordWeight * (needle.length / haystack.length)
                }
                return 0;
            })

            return needleScores.reduce((a, b) => a + b, 0);
        });

        this.lastSearchScore = scores.reduce((a, b) => a + b, 0);
    }
}

export default MatchSearch