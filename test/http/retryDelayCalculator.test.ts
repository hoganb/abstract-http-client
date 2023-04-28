import type { RetryObject } from 'got/dist/source';

import { retryDelayCalculator } from '../../src/http/retryDelayCalculator';

describe('retryDelayCalculator', () => {
  it('should return 0 when computed value is 0', () => {
    expect(
      retryDelayCalculator(
        1,
        1
      )({ attemptCount: 1, computedValue: 0, error: {} } as RetryObject)
    ).toEqual(0);
  });

  it('should return 1 when is a request error', () => {
    expect(
      retryDelayCalculator(
        1,
        1
      )({ computedValue: 1, error: { name: 'RequestError' } } as RetryObject)
    ).toEqual(1);
  });

  it('should return exponential backoff value', () => {
    const value1 = retryDelayCalculator(
      1000,
      100
    )({ attemptCount: 1, computedValue: 1, error: {} } as RetryObject);
    expect(value1).toBeGreaterThan(1000);
    expect(value1).toBeLessThanOrEqual(1100);

    const value2 = retryDelayCalculator(
      1000,
      100
    )({ attemptCount: 2, computedValue: 1, error: {} } as RetryObject);
    expect(value2).toBeGreaterThan(2000.01);
    expect(value2).toBeLessThanOrEqual(2100);
  });
});
