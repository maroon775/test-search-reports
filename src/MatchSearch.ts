import BaseSearch from './BaseSearch';
import arraySumValues from './libs/arraySumValues';

interface IMatchSearchOptions {
    minNeedleWordLength?: number;
    strict?: boolean
}
const defaultOptions = {
    minNeedleWordLength: 2,
    strict: false
};

type MatchSearchDefaults = typeof defaultOptions;


class MatchSearch extends BaseSearch<IMatchSearchOptions | undefined, MatchSearchDefaults> {
    constructor(options: IMatchSearchOptions| undefined) {
        super(options, defaultOptions);
    }

    getScore(): number {
        return this.searchScore;
    }

    search(needleWords: string[], haystackWords: string[]): void {
        const needleWordsFiltered = needleWords.filter(i => this.options.minNeedleWordLength <= i.length);
        const wordWeight = 1 / haystackWords.length;

        if(needleWordsFiltered.length <= 0) {
            this.searchScore = 1;
            return;
        }

        const scores = needleWordsFiltered.map(needle => {
            const needleScores = haystackWords.map((haystack) => {
                if (needle.trim() === haystack.trim()) {
                    return wordWeight;
                }
                if (!this.options.strict && haystack.includes(needle)) {
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