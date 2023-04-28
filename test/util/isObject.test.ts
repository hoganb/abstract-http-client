import { isObject } from '../../src/util';

describe('isObject', () => {
  it('should check if the passed value is a non-null object', () => {
    expect(isObject({})).toEqual(true);
    expect(isObject(new Date())).toEqual(true);
    expect(isObject('foo')).toEqual(false);
    expect(isObject(null)).toEqual(false);
    expect(isObject(undefined)).toEqual(false);
    expect(isObject(['a'])).toEqual(true);
  });
});
