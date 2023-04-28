import type { LoggerOptions } from 'winston';
import winston from 'winston';

import { getLogger } from '../../src/logger';

jest.mock('../../src/logger/logTransports', () => {
  return {
    logTransports: jest.fn(() => []),
  };
});

describe('getLogger', () => {
  it('should return the same Logger instance', () => {
    const spy = jest.spyOn(winston, 'createLogger');
    const expectedArgument: LoggerOptions = {
      defaultMeta: {
        service: 'abstract-http-client',
      },
      exitOnError: false,
      level: 'debug',
      transports: [],
      levels: {
        debug: 5,
        error: 0,
        http: 3,
        info: 2,
        silly: 6,
        verbose: 4,
        warn: 1,
      },
    };

    const logger = getLogger();
    expect(logger).toBeDefined();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining(expectedArgument));
    expect(spy).toBeCalledTimes(1);

    // should be same logger instance
    const loggerTwo = getLogger();
    expect(spy).toBeCalledTimes(1);
    expect(logger === loggerTwo).toEqual(true);
  });
});
