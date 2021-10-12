Install dependency:

`npm i --save @maroon775/levenshtein-search`

Or

`yarn add @maroon775/levenshtein-search`


```
import Search, { LevenshteinSearch, MatchSearch } from "@maroon775/levenshtein-search";

const dataItems = [
    {
        "name": "Leanne Graham",
    },
    {
        "name": "Ervin Howell",
    },
    {
        "name": "Clementine Bauch",
    },
    {
        "name": "Patricia Lebsack",
    }, 
    {
        "name": "Chelsey Dietrich",
    }
];

const configFields = [
    { key: "name", weight: 1 }
];

const searchInstance = new Search(dataItems, {
    fields: configFields,
    caseSensitive: false
});

searchInstance.addSearchModule(MatchSearch, { minNeedleWordLength: 2, strict: false });

searchInstance.addSearchModule(LevenshteinSearch, {
minNeedleWordLength: 2,
maxLevenshteinDistance: 2
});


const searchResults = searchInstance.search('Chesley');

```

Demo:
https://codesandbox.io/s/maroon775-search-levenshtein-zkm72
