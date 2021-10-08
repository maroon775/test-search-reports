import BaseSearch from './BaseSearch';
import arraySumValues from './libs/arraySumValues';

interface IMatchSearchOptions {
    minNeedleWordLength: number,
}

class MatchSearch extends BaseSearch<IMatchSearchOptions> {
    constructor(options: IMatchSearchOptions) {
        const defaultOptions: IMatchSearchOptions = {
            minNeedleWordLength: 2,
        };
        super(options, defaultOptions);
    }

    getScore(): number {
        return this.searchScore;
    }

    search(needleWords: string[], haystackWords: string[]): void {
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