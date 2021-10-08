import stringToArray from './libs/stringToArray';
class SearchInit {
    constructor(dataItems, options) {
        this.options = {
            caseSensitive: false,
            fields: [{
                    key: 'title',
                    weight: 1,
                }],
        };
        if (!('fields' in options)
            || !Array.isArray(options.fields)
            || options.fields.length <= 0) {
            throw new Error('"fields" is required parameter');
        }
        if (dataItems && !Array.isArray(dataItems)) {
            throw new Error('dataItems should be an array');
        }
        if (options) {
            this.options = options;
        }
        this.dataset = this.createDataset(dataItems);
    }
    createDataset(dataItems) {
        const { fields, caseSensitive } = this.options;
        return dataItems.map((row) => {
            row.__datasets = {};
            fields.forEach(({ key }) => {
                row.__datasets[key] = [];
                const fieldData = row[key];
                if (!fieldData) {
                    return;
                }
                if (Array.isArray(fieldData)) {
                    row.__datasets[key] = fieldData
                        .map((item) => stringToArray(caseSensitive ? item : item.toLowerCase()))
                        .flat() || [];
                }
                else if (typeof fieldData === 'string') {
                    row.__datasets[key] = stringToArray(caseSensitive ? fieldData : fieldData.toLowerCase());
                }
            });
            return row;
        });
    }
    totalScoringModules(haystack, weight) {
        const result = { score: 0, modules: {} };
        this.modules.forEach((module) => {
            module.instance.search(this.queryset, haystack);
            const score = module.instance.getScore() * weight;
            result.score += score;
            result.modules[module.name] = score;
        });
        return result;
    }
    static flatSort(itemL, itemR) {
        const a = itemL.__scorings.score;
        const b = itemR.__scorings.score;
        if (a === b)
            return 0;
        return a > b ? -1 : 1;
    }
    addSearchModule(Module, options) {
        const instance = new Module(options);
        this.modules.push({ instance, name: Module.name });
    }
    search(queryString) {
        if (!queryString)
            return this.dataset;
        this.queryset = stringToArray(queryString, 1);
        const result = this.dataset.map(item => {
            item.__scorings = {
                score: 0,
                fields: {},
            };
            this.options.fields.forEach(field => {
                const itemFieldDataset = item.__datasets[field.key];
                const scoringResult = this.totalScoringModules(itemFieldDataset, field.weight);
                item.__scorings.score += scoringResult.score;
                item.__scorings.fields[field.key] = scoringResult;
            });
            return item;
        });
        result.sort(SearchInit.flatSort);
        const sliceIndex = result.findIndex(i => i.__scorings.score === 0);
        if (sliceIndex === 0)
            return [];
        return result.slice(0, sliceIndex - 1);
    }
}
export default SearchInit;
