import Search, {MatchSearch, LevenshteinSearch} from '../src';
import BaseSearch from "../src/BaseSearch";
import * as mock from './mock';

describe('Search module', () => {
    let instance: Search;

    beforeEach(() => {
        instance = new Search(mock.getArrayItems(), {
            fields: [
                {
                    key: 'keywords',
                    weight: 1
                }
            ]
        });
    });

    it('search without modules', () => {
        const searchResult = instance.search('optimism');
        expect(searchResult).toEqual(mock.getArrayItems());
    });

    it('Search without modules & with empty query', () => {
        const searchResult = instance.search('');
        expect(searchResult).toEqual(mock.getArrayItems());
    });

    it('MatchSearch instanceof BaseSearch', () => {
        instance.addSearchModule(MatchSearch);
        expect(instance.modules[0].instance).toBeInstanceOf(BaseSearch);
    })
    it('LevenshteinSearch instanceof BaseSearch', () => {
        instance.addSearchModule(LevenshteinSearch);
        expect(instance.modules[0].instance).toBeInstanceOf(BaseSearch);
    })

    it('Valid adding module search', () => {
        instance.addSearchModule(MatchSearch);
        expect(instance.modules.length).toEqual(1);
    });

    it('Valid adding module search with options', () => {
        instance.addSearchModule(MatchSearch, {minNeedleWordLength: 987654321, strict: false});

        expect(instance.modules[0].instance.options).toEqual({minNeedleWordLength: 987654321, strict: false});
    });

    it('Adding two modules', () => {
        instance.addSearchModule(MatchSearch);
        instance.addSearchModule(LevenshteinSearch);

        expect(instance.modules.length).toEqual(2);
    });

    it('Should test the Search.flatSort', () => {
        const sortFn = jest.spyOn(Search as any, 'flatSort');
        const instanceSearch = new Search(mock.getArrayItems(), {
            fields: [
                {
                    key: 'name',
                    weight: 1
                }
            ]
        });
        instanceSearch.addSearchModule(MatchSearch, {strict: true});

        expect(instanceSearch.search('behavior')).toEqual([mock.item4]);
        expect(sortFn).toHaveBeenCalled();
    });
});