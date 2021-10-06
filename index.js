import data from './reportsWithKeywords.json';
// import levenstein from "./libs/levenshtein";
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

function search(query, data) {

    const searchEngine = new SearchInit(data, {
        fields: dataFieldsWeightConfig,
        caseSensitive: false
    })
    searchEngine.addSearchModule(MatchSearch, {minNeedleWordLength: 3})
    // searchEngine.addSearchModule(LevenshteinSearch, {minNeedleWordLength: 3})
    const result = searchEngine.search(query);

    result.forEach((item, i) => {
        console.log(i, item.name, item.__searchMetadata.weight);
    })
}

// console.log(data.reports);
search('pitch perfect', data.reports)