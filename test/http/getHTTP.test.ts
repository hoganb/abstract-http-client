import type { HTTP } from '../../src/http';
import { getHTTP } from '../../src/http';
import { LoggingHTTPDecorator } from '../../src/http/LoggingHTTPDecorator';

describe('getHTTP', () => {
  it('should create a LoggingHTTPDecorator instance', () => {
    const logger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      on: jest.fn(),
      end: jest.fn(),
    };
    const http: HTTP = getHTTP(logger);
    expect(http).toBeInstanceOf(LoggingHTTPDecorator);
    expect(http === getHTTP(logger)).toEqual(false);
  });
});
