import { roundedNumber } from '../../src/util';

describe('roundedNumber', () => {
  it('should round a number up', () => {
    expect(roundedNumber(33.5)).toEqual(34);
  });

  it('should round a number down', () => {
    expect(roundedNumber(33.4)).toEqual(33);
  });

  it('should default to undefined when not a valid number', () => {
    expect(roundedNumber(undefined)).toEqual(undefined);
    expect(roundedNumber(NaN)).toEqual(undefined);
  });
});
