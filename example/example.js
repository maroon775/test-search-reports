import Search, {MatchSearch, LevenshteinSearch} from "../dist/index.js";
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




const search = new Search(data.reports, {
    fields: fieldsMap,
    caseSensitive: false
});

search.addSearchModule(MatchSearch, {minNeedleWordLength: 3});
search.addSearchModule(LevenshteinSearch, {minNeedleWordLength: 3, maxLevenshteinDistance: 2});

function logTable(reports) {
    let table = [];
    reports.forEach((item, i) => {
        table.push({
            ID: item.id,
            name: item.name,
            score: item.__scorings ? item.__scorings.score : 0
        });
    });
    console.table(table);
}


let query = 'test';
let result = search.search(query);
console.log('Results for query:', query);
logTable(result);

query = 'medicine'
result = search.search(query);
console.log('Results for query:', query);
logTable(result);