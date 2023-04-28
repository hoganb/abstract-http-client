import { stringToNumber } from '../../src/util';

describe('stringToNumber', () => {
  it('should convert a string to a number', () => {
    expect(stringToNumber('-1')).toEqual(-1);
    expect(stringToNumber('0')).toEqual(0);
    expect(stringToNumber('1')).toEqual(1);
  });

  it('should default to undefined when unable to convert to a number', () => {
    expect(stringToNumber(undefined)).toEqual(undefined);
    expect(stringToNumber('')).toEqual(undefined);
    expect(stringToNumber('a')).toEqual(undefined);
  });
});
