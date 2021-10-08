import stringToArray from './libs/stringToArray';
import BaseSearch from './BaseSearch';


interface Obj {
    [key: string]: any;
}

interface Score {
    score: number;
}

interface FieldScoring extends Score {
    modules: { // module scoring for field
        [key: string]: number,
    }
}

interface ItemScoring extends Score {
    fields: {
        [key: string]: FieldScoring
    }
}


interface Dataset {
    [key: string]: string[];
}

interface DatasetItemStructure extends Obj {
    __datasets: Dataset
    __scorings: ItemScoring
}

interface FieldsOptionItem {
    key: string,
    weight: number
}

interface SearchInitOptions {
    caseSensitive: false,
    fields: FieldsOptionItem[]
}

interface ModuleInstance {
    instance: BaseSearch;
    name: string;
}

interface ISearchInit {
    modules: ModuleInstance[];
    options: SearchInitOptions;
    dataset: DatasetItemStructure[];
    queryset: string[]

    // createDataset(data: DatasetItemStructure[]): DatasetItemStructure[];
    search(queryString: string): DatasetItemStructure[];

    addSearchModule<T, O>(Module: new (options: O) => T & BaseSearch, options: O): void;
}

class SearchInit implements ISearchInit {
    modules!: ModuleInstance[];

    options: SearchInitOptions = {
        caseSensitive: false,
        fields: [{
            key: 'title',
            weight: 1,
        }],
    };

    dataset;

    queryset!: string[];

    constructor(dataItems: Obj[], options: SearchInitOptions) {
        if (!('fields' in options)
            || !Array.isArray(options.fields)
            || options.fields.length <= 0
        ) {
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

    private createDataset(dataItems: Obj[]): DatasetItemStructure[] {
        const {fields, caseSensitive} = this.options;
        return dataItems.map((row) => {
            row.__datasets = {};

            fields.forEach(({key}) => {
                row.__datasets[key] = [];
                const fieldData: string | string[] = row[key];

                if (!fieldData) {
                    return;
                }

                if (Array.isArray(fieldData)) {
                    row.__datasets[key] = fieldData
                        .map((item) => stringToArray(caseSensitive ? item : item.toLowerCase()))
                        .flat() || [];
                } else if (typeof fieldData === 'string') {
                    row.__datasets[key] = stringToArray(caseSensitive ? fieldData : fieldData.toLowerCase());
                }
            });

            return <DatasetItemStructure>row;
        });
    }

    private totalScoringModules(haystack: string[], weight: number) {
        const result: FieldScoring = {score: 0, modules: {}};
        this.modules.forEach((module: ModuleInstance) => {
            module.instance.search(this.queryset, haystack);
            const score = module.instance.getScore() * weight;

            result.score += score;
            result.modules[module.name] = score;
        });

        return result;
    }

    private static flatSort(itemL: DatasetItemStructure, itemR: DatasetItemStructure) {
        const a = itemL.__scorings.score;
        const b = itemR.__scorings.score;

        if (a === b) return 0;
        return a > b ? -1 : 1;
    }

    addSearchModule<T, O>(Module: new(options: O) => T & BaseSearch, options: O): void {
        const instance = new Module(options);
        this.modules.push({instance, name: Module.name});
    }

    search(queryString: string): DatasetItemStructure[] {
        if (!queryString) return this.dataset;

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

        if (sliceIndex === 0) return [];

        return result.slice(0, sliceIndex - 1);
    }
}

export default SearchInit;