import data from './reportsWithKeywords.json';
import SearchInit from "./Search.js";
import MatchSearch from "./MatchSearch.js";
import LevenshteinSearch from "./LevenshteinSearch.js";

const dataFieldsWeightConfig = [
    {
        key: 'name',
        weight: 0.5,
    },
    {
        key: 'category',
        weight: 0.3,
    },
    {
        key: 'keywords',
        weight: 0.2
    }
];

function search(query, data, searchStrategies = []) {
    if(!query) return data;

    const searchEngine = new SearchInit(data, {
        fields: dataFieldsWeightConfig,
        caseSensitive: false
    });

    searchStrategies.forEach(strategy => {
        searchEngine.addSearchModule(strategy.module, strategy.options);
    });


    return searchEngine.search(query);
}

const result = search('sleep', data.reports, [
    {module: MatchSearch, options: {minNeedleWordLength: 3}},
    {module: LevenshteinSearch, options: {minNeedleWordLength: 3, maxLevenshteinDistance: 2}},
]);

console.log('#', '|', 'ID', '|', 'name', '|', 'score');
result.forEach((item, i) => {
    console.log(i, '|', item.id, '|', item.name, '|', item.__searchMetadata.score);
});