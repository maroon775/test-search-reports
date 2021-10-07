function stringToArray(string, wordMinLength = 2) {
    return String(string)
        .split(/[\s,.;:]+/)
        .map(s => s.trim())
        .filter(i => i.length >= wordMinLength);
}

class SearchInit {
    __modules = [];
    __options = {
        caseSensitive: false,
        fields: [{
            key: 'title',
            weight: 1
        }]
    };
    __dataset = [];
    __queryset = [];

    constructor(dataItems, options) {
        if (!options.hasOwnProperty('fields')
            || !Array.isArray(options.fields)
            || options.fields.length <= 0
        ) {
            throw new Error('"fields" is required parameter')
        }
        if (dataItems && !Array.isArray(dataItems)) {
            throw new Error('dataItems should be an array');
        }

        if(options) {
            this.__options = options;
        }

        this.__dataset = this.createDataset(dataItems);
    }

    createDataset(dataItems) {
        const {fields, caseSensitive} = this.__options;
        return Array
            .from(dataItems)
            .map(row => {
                row.__searchMetadata = {score: 0};
                for (let i = 0; i < fields.length; i++) {
                    const fieldName = fields[i].key;
                    row.__searchMetadata[fieldName] = {
                        words: [],
                        score: 0,
                        scoringResult: {}
                    }
                    const fieldData = row[fieldName];
                    let dataset;

                    if (!fieldData) {
                        continue;
                    }

                    if (Array.isArray(fieldData)) {
                        dataset = fieldData.map((item) => {
                            return stringToArray(caseSensitive ? item : item.toLowerCase());
                        }).flat();
                    } else if (typeof fieldData === 'string') {
                        dataset = stringToArray(caseSensitive ? fieldData : fieldData.toLowerCase());
                    }
                    row.__searchMetadata[fieldName].words = dataset;
                }
                return row;
            });
    }

    search(queryString) {
        if(!queryString) return this.__dataset;

        const {fields} = this.__options;
        this.__queryset = stringToArray(queryString, 1);

        this.__dataset.forEach(item => {
            fields.forEach(field => {
                const itemFieldMetadata = item.__searchMetadata[field.key];

                const scoringResult = this.totalScoringModules(itemFieldMetadata.words, field.weight);
                itemFieldMetadata.scoringResult = scoringResult;
                itemFieldMetadata.score = scoringResult.score;

                item.__searchMetadata.score += itemFieldMetadata.score;
            });

        });

        this.__dataset.sort(this.flatSort);

        const sliceIndex = this.__dataset.findIndex(i => i.__searchMetadata.score === 0);
        return this.__dataset.slice(0, sliceIndex-1); // cut with zero score;
    }

    totalScoringModules(haystack, weight) {
        const result = {score: 0, modules: {}};
        this.__modules.forEach((module)=> {
            module.instance.search(this.__queryset, haystack);
            const score = module.instance.getScore() * weight;

            result.score += score;
            result.modules[module.name] = score;
        });

        return result;
    }

    /*modulesSort(itemL, itemR) {
        let sortValue = 0;
        for(let i = 0, l = this.__modules.length; i < l && sortValue === 0; i++) {
            const  mod = this.__modules[i];
            const a = itemL.__searchMetadata.scoringResult.modules[mod.name],
                b = itemR.__searchMetadata.scoringResult.modules[mod.name];

                if( a === b ) sortValue = 0;
                sortValue = a > b ? -1 : 1;
        }
        return sortValue;
    }*/

    flatSort(itemL, itemR) {
        const a = itemL.__searchMetadata.score,
            b = itemR.__searchMetadata.score;

        if( a === b ) return 0;
        return a > b ? -1 : 1;
    }


    addSearchModule(module, options = {}) {
        const instance = new module(options);
        this.__modules.push({instance, name: module.name});
    }
}

export default SearchInit