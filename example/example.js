import Search, {MatchSearch, LevenshteinSearch} from "../src/index.js";
import data from "./reportsWithKeywords.json";

const fieldsMap = [
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



const query = 'test';

const search = new Search(data.reports, {
    fields: fieldsMap,
    caseSensitive: false
});

search.addSearchModule(MatchSearch, {minNeedleWordLength: 3});
search.addSearchModule(LevenshteinSearch, {minNeedleWordLength: 3, maxLevenshteinDistance: 2});

const result = search.search(query);

console.log('Results for query:', query);
const table = [];
result.forEach((item, i) => {
    table.push({
        ID: item.id,
        name: item.name,
        score: item.__searchMetadata.score
    });
});
console.table(table)