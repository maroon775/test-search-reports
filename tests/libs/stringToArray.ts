import stringToArray from "../../src/libs/stringToArray";

describe('stringToArray', () => {
    it('One word string', () => {
        expect(stringToArray('bubble')).toEqual(['bubble'])
    });

    it('Multiple words', () => {
        expect(stringToArray('green blue orange black yellow white')).toEqual(['green', 'blue', 'orange', 'black', 'yellow','white'])
    });

    it('Words of at least three letters', () => {
        expect(stringToArray('a bc def ghjk', 3)).toEqual(['def', 'ghjk'])
    });

    it('Unchanging sequence', () => {
        expect(stringToArray('a b c d e', 1)).toEqual(['a', 'b', 'c', 'd', 'e'])
    });
})