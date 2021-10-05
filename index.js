import data from './reportsWithKeywords.json';

const dataFieldsWeightConfig = {
    name: 0.5,
    category: 0.3,
    keywords: 0.2
};

const searchStringWeight = (query, string) => {
    const regFullSearch = new RegExp(query.toLowerCase(), 'gi');
    const fullSearchWeight = (string.match(regFullSearch) || []).length;
    const delimiter = /\s|,|\.|;|:/;

    if(fullSearchWeight === 0) {
        const searchWords = query.split(delimiter).filter(i => i.replace(delimiter).trim().length > 1);
        if (searchWords.length > 1) {
            const perWordWeight = 1 / (searchWords.length || 1);
            const regWords = new RegExp(searchWords.join('|').toLowerCase(), 'gi');
            const wordsWeight = (string.match(regWords) || []).length * perWordWeight;

            return wordsWeight + fullSearchWeight;
        }
    }
    return fullSearchWeight;
}


function search(query, data, levenshteinEngine = true) {
    console.log();
    const resultItems = data.map((item, index) => {
        const propsWeight = Object
            .entries(dataFieldsWeightConfig)
            .map(([prop, propWeight]) => {
                return {
                    prop,
                    weight: searchStringWeight(query, item[prop].toString()) * propWeight
                };
            });
        const weight = propsWeight.reduce((sum, {weight}) => sum+weight, 0);

        if(weight > 0) {
            console.log(index, propsWeight)
        }
        return {index, propsWeight, weight};
    }).filter(i=>i.weight);

    // console.log('ranged', [...resultItems]);

    resultItems.sort((itemLeft, itemRight) => {
        return itemLeft.weight > itemRight.weight ? -1 : 1;
    });

    console.log('ranged & sorted', resultItems);

    return resultItems;
}

// console.log(data.reports);
search('bone density', data.reports)