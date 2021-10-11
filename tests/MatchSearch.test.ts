import {MatchSearch} from "../src";
import Search from "../src/Search";
import * as mock from './mock';

describe('MatchSearch strategy', () => {
    let instance: Search;
    beforeEach(() => {
        instance = new Search(mock.getArrayItems(), {
            fields: [{
                key: 'keywords',
                weight: 1
            }]
        })
    })
    it('Empty query', () => {
        instance.addSearchModule(MatchSearch);
        const result = instance.search('');
        expect(result).toEqual(mock.getArrayItems());
    });
    it('Shorter query', () => {
        instance.addSearchModule(MatchSearch, {minNeedleWordLength: 5});
        const result = instance.search('love');
        expect(result).toEqual(mock.getArrayItems());
    });
    it('One result', () => {
        instance.addSearchModule(MatchSearch);
        const result = instance.search('Rosacea');
        expect(result).toEqual([mock.item2]);
    });

    it('Multiple results', () => {
        instance.addSearchModule(MatchSearch);
        const result = instance.search('happiness');
        expect(result).toEqual([mock.item3, mock.item4]);
    });

    it('With options', () => {
        instance.addSearchModule(MatchSearch, {minNeedleWordLength: 5});
        const result = instance.search('bonding, mood');
        expect(result).toEqual([mock.item4]);
    });

    it('With another option value', () => {
        instance.addSearchModule(MatchSearch, {minNeedleWordLength: 3});
        const result = instance.search('bonding, mood');
        expect(result).toEqual([mock.item4, mock.item3]);
    });

})