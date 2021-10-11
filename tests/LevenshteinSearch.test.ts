import {LevenshteinSearch} from "../src";
import Search from "../src/Search";
import * as mock from './mock';

describe('LevenshteinSearch strategy', () => {
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
        instance.addSearchModule(LevenshteinSearch);
        const result = instance.search('');
        expect(result).toEqual(mock.getArrayItems());
    });
    it('Shorter query', () => {
        instance.addSearchModule(LevenshteinSearch, {minNeedleWordLength: 5});
        const result = instance.search('love');
        expect(result).toEqual(mock.getArrayItems());
    });

    it('One result', () => {
        instance.addSearchModule(LevenshteinSearch);
        const result = instance.search('red');

        expect(result).toEqual([mock.item2]);
    });

    it('Multiple result', () => {
        instance.addSearchModule(LevenshteinSearch);
        const result = instance.search('good');
        expect(result).toEqual([mock.item3,mock.item4]);
    });

})