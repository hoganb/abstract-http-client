import type { RetryFunction, RetryObject } from 'got/dist/source';

export const retryDelayCalculator = (
  factor: number,
  noise: number
): RetryFunction => {
  return (retryObject: RetryObject) => {
    // If not applicable to retry then computed value is zero
    if (retryObject.computedValue === 0) {
      return retryObject.computedValue;
    }
    // If error is network related then retry with immediate effect
    if (retryObject.error.name === 'RequestError') {
      return 1;
    }
    // Exponential backoff value computed based upon attempts using `factor * Math.pow(2, retry) + Math.random() * noise`, where:
    //    - `factor` is config-driven and defaults to `1000`
    //    - `retry` is attempt number (starts from 1)
    //    - `noise` is config-driven and defaults to `100`
    const value: number =
      factor * Math.pow(2, retryObject.attemptCount - 1) +
      Math.random() * noise;
    return value;
  };
};
