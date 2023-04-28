import { isNonEmptyString } from '../../src/util';

describe('isNonEmptyString', () => {
  it('should check if the passed value is a non-empty string', () => {
    expect(isNonEmptyString('foo')).toEqual(true);
    expect(isNonEmptyString('')).toEqual(false);
    expect(isNonEmptyString(' ')).toEqual(false);
    expect(isNonEmptyString(null)).toEqual(false);
    expect(isNonEmptyString(undefined)).toEqual(false);
  });
});
