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
    const result = searchEngine.search(query);
}

// console.log(data.reports);
const result = search('sleep', data.reports, [
    {module: MatchSearch, options: {minNeedleWordLength: 3}},
    {module: LevenshteinSearch, options: {minNeedleWordLength: 3, maxLevenshteinDistance: 2}},
]);//[data.reports.find(({id}) => id === 25)])

result.forEach((item, i) => {
    console.log(i, item.id, item.name, item.__searchMetadata.score);
})