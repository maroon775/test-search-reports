import levenshtein from "../../src/libs/levenshtein";


describe('Levenshtein function', () => {

    it('Valid distance for Apple->apple', () => {
        expect(levenshtein('Apple', 'apple')).toEqual(1);
    });
    it('Valid distance for notepad->notepad', () => {
        expect(levenshtein('notepad', 'notepad')).toEqual(0);
    });
    it('Valid distance for world->word', () => {
       expect(levenshtein('world', 'word')).toEqual(1);
    });
    it('Valid distance for hello world->help work', () => {
       expect(levenshtein('hello world', 'help work')).toEqual(4);
    });
    it('Valid distance for help work->hello world', () => {
       expect(levenshtein('help work', 'hello world')).toEqual(4);
    });
    it('Empty arguments', () => {
       expect(levenshtein('', '')).toEqual(0);
    });
});