import data from './reportsWithKeywords.json';import levenstein from "./libs/levenshtein";

const dataFieldsWeightConfig = {
    name: 0.5,
    category: 0.3,
    keywords: 0.2
};

const searchStringWeight = (query, string) => {
    const q = query.toLowerCase()
    const regFullSearch = new RegExp(q, 'gi');
    const fullSearchWeight = (string.match(regFullSearch) || []).length;

    if (fullSearchWeight === 0) {
        const delimiter = /\s|,|\.|;|:/;
        const searchWords = q.split(delimiter).filter(i => i.replace(delimiter).trim().length > 1);

        if (searchWords.length > 1) {
            const perWordWeight = 1 / (searchWords.length || 1);
            const regWords = new RegExp(searchWords.join('|'), 'gi');
            const wordsWeight = (string.match(regWords) || []).length * perWordWeight;

            return wordsWeight + fullSearchWeight;
        }
    }
    return fullSearchWeight;
}


function search(query, data) {
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
        const weight = propsWeight.reduce((sum, {weight}) => sum + weight, 0);

        if (weight > 0) {
            console.log(index, propsWeight)
        }
        return {index, propsWeight, weight};
    }).filter(i => i.weight);

    // console.log('ranged', [...resultItems]);

    resultItems.sort((itemLeft, itemRight) => {
        return itemLeft.weight > itemRight.weight ? -1 : 1;
    });

    console.log('ranged & sorted', resultItems);

    return resultItems;
}

// console.log(data.reports);
search('bone density', data.reports)