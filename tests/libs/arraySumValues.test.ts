import arraySumValues from "../../src/libs/arraySumValues";

describe('Test arraySumValues', () => {
  it('Empty array', () => {
    expect(arraySumValues([])).toEqual(0);
  })
  it('Simple two values', () => {
    expect(arraySumValues([1, 2])).toEqual(3);
  })
  it('More two values', () => {
    expect(arraySumValues([1,2,3,4,5])).toEqual(15);
  })
  it('Negative numbers', () => {
    expect(arraySumValues([-2, -1])).toEqual(-3);
  });
});