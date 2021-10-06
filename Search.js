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
                row.__searchMetadata = {};
                for (let i = 0; i < fields.length; i++) {
                    const fieldName = fields[i].key;
                    row.__searchMetadata[fieldName] = {
                        words: [],
                        weight: 0
                    }
                    const fieldData = row[fieldName];
                    let dataset;

                    // if (!fieldData) {
                    //     continue;
                    // }

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
        const {fields} = this.__options;
        this.__queryset = stringToArray(queryString, 1);

        this.__dataset.forEach(item => {
            let itemWeight = 0;
            fields.forEach(field => {
                const itemFieldMetadata = item.__searchMetadata[field.key];
                const words = itemFieldMetadata.words;

                const scores = [];
                this.__modules.forEach(moduleInstance => {
                    moduleInstance.search(this.__queryset, words);
                    const score = moduleInstance.getScore();
                    scores.push(score);
                });

                itemFieldMetadata.weight = scores.reduce((a, i) => a+i, 0) * field.weight;

                itemWeight +=itemFieldMetadata.weight;
            });

            item.__searchMetadata.weight = itemWeight;
        });
        this.__dataset.sort((itemL, itemR) => {
            return itemL.__searchMetadata.weight > itemR.__searchMetadata.weight ? -1 : 1;
        });

        return this.__dataset;
    }


    addSearchModule(module, options = {}) {
        const instance = new module(options);
        this.__modules.push(instance);
    }
}

export default SearchInit