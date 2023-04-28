import { HTTPRequestError, HTTPResponseError } from '../../src/errors';
import type { HTTP, Request } from '../../src/http';
import { LoggingHTTPDecorator } from '../../src/http/LoggingHTTPDecorator';
import type { Logger } from '../../src/logger';
import { timer } from '../../src/util';

describe('LoggingHTTPDecorator', () => {
  describe('send', () => {
    it('should log request and response on 2xx status code response with body', async () => {
      const logger: Logger = {
        debug: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        log: jest.fn(),
        warn: jest.fn(),
        on: jest.fn(),
        end: jest.fn(),
      };
      const url = 'http://localhost/api';
      const request: Request = {
        action: 'test',
        method: 'POST',
        url,
      };
      await createLoggingHTTPDecorator({
        http: {
          send: async () => {
            return Promise.resolve({
              body: Buffer.from('hello world', 'utf-8'),
              headers: {
                'content-length': '11',
                'content-type': 'text/plain',
              },
              retryCount: 0,
              statusCode: 200,
              timings: {
                phases: {
                  dns: 0,
                  download: 0,
                  firstByte: 0,
                  request: 0,
                  tcp: 0,
                  tls: undefined,
                  total: 0,
                  wait: 0,
                },
              },
            });
          },
        },
        logger,
      }).send(request);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, 'http_client_request', {
        request: {
          action: 'test',
          hostname: 'localhost',
          method: 'POST',
          port: 80,
          protocol: 'http',
          url,
        },
      });
      expect(logger.debug).toHaveBeenNthCalledWith(2, 'http_client_response', {
        request: {
          action: 'test',
          hostname: 'localhost',
          method: 'POST',
          port: 80,
          protocol: 'http',
          url,
        },
        response: {
          contentEncoding: undefined,
          contentLength: 11,
          contentType: 'text/plain',
          duration: 0,
          retryCount: 0,
          statusCode: 200,
          timingPhases: {
            dns: 0,
            download: 0,
            firstByte: 0,
            request: 0,
            tcp: 0,
            tls: undefined,
            total: 0,
            wait: 0,
          },
        },
      });
    });

    it('should log request and response on 2xx status code response without body', async () => {
      const logger: Logger = {
        debug: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        log: jest.fn(),
        warn: jest.fn(),
        on: jest.fn(),
        end: jest.fn(),
      };
      const url = 'https://localhost/api';
      const request: Request = {
        method: 'POST',
        url,
      };
      await createLoggingHTTPDecorator({
        http: {
          send: async () => {
            return Promise.resolve({
              body: Buffer.alloc(0),
              headers: {},
              retryCount: 0,
              statusCode: 204,
              timings: {
                phases: {
                  dns: 0,
                  download: 0,
                  firstByte: 0,
                  request: 0,
                  tcp: 0,
                  tls: 0,
                  total: 0,
                  wait: 0,
                },
              },
            });
          },
        },
        logger,
      }).send(request);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, 'http_client_request', {
        request: {
          action: undefined,
          hostname: 'localhost',
          method: 'POST',
          port: 443,
          protocol: 'https',
          url,
        },
      });
      expect(logger.debug).toHaveBeenNthCalledWith(2, 'http_client_response', {
        request: {
          action: undefined,
          hostname: 'localhost',
          method: 'POST',
          port: 443,
          protocol: 'https',
          url,
        },
        response: {
          contentEncoding: undefined,
          contentLength: undefined,
          contentType: undefined,
          duration: 0,
          retryCount: 0,
          statusCode: 204,
          timingPhases: {
            dns: 0,
            download: 0,
            firstByte: 0,
            request: 0,
            tcp: 0,
            tls: 0,
            total: 0,
            wait: 0,
          },
        },
      });
    });

    it('should log request and response error on 4xx status code response', async () => {
      const logger: Logger = {
        debug: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        log: jest.fn(),
        warn: jest.fn(),
        on: jest.fn(),
        end: jest.fn(),
      };
      const url = 'http://localhost:3000/api';
      const request: Request = {
        method: 'POST',
        url,
      };
      try {
        await createLoggingHTTPDecorator({
          http: {
            send: async () => {
              return Promise.reject(
                new HTTPResponseError(
                  {
                    body: Buffer.from(
                      JSON.stringify({
                        error: { message: 'Validation error' },
                      }),
                      'utf-8'
                    ),
                    headers: {
                      'content-type': 'application/json',
                    },
                    retryCount: 0,
                    statusCode: 400,
                    timings: {
                      phases: {
                        dns: 0,
                        download: 0,
                        firstByte: 0,
                        request: 0,
                        tcp: 0,
                        tls: undefined,
                        total: 0,
                        wait: 0,
                      },
                    },
                  },
                  undefined
                )
              );
            },
          },
          logger,
        }).send(request);
      } catch (error) {
        expect(logger.debug).toHaveBeenCalledTimes(1);
        expect(logger.debug).toHaveBeenNthCalledWith(1, 'http_client_request', {
          request: {
            action: undefined,
            hostname: 'localhost',
            method: 'POST',
            port: 3000,
            protocol: 'http',
            url,
          },
        });
        expect(logger.log).toHaveBeenCalledTimes(1);
        expect(logger.log).toHaveBeenNthCalledWith(
          1,
          'error',
          'http_client_response',
          {
            error: {
              cause: undefined,
              message: '',
              name: 'HTTPResponseError',
              responseBody: {
                error: { message: 'Validation error' },
              },
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              stack: expect.stringContaining('Error:'),
            },
            request: {
              action: undefined,
              hostname: 'localhost',
              method: 'POST',
              port: 3000,
              protocol: 'http',
              url,
            },
            response: {
              contentEncoding: undefined,
              contentLength: undefined,
              contentType: 'application/json',
              duration: 0,
              retryCount: 0,
              statusCode: 400,
              timingPhases: {
                dns: 0,
                download: 0,
                firstByte: 0,
                request: 0,
                tcp: 0,
                tls: undefined,
                total: 0,
                wait: 0,
              },
            },
          }
        );
      }
    });

    it('should log request and response error on 5xx status code response', async () => {
      const logger: Logger = {
        debug: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        log: jest.fn(),
        warn: jest.fn(),
        on: jest.fn(),
        end: jest.fn(),
      };
      const url = 'http://localhost:3000/api';
      const request: Request = {
        method: 'POST',
        url,
      };
      try {
        await createLoggingHTTPDecorator({
          http: {
            send: async () => {
              return Promise.reject(
                new HTTPResponseError(
                  {
                    body: Buffer.alloc(0),
                    headers: {},
                    retryCount: 0,
                    statusCode: 500,
                    timings: {
                      phases: {
                        dns: 0,
                        download: 0,
                        firstByte: 0,
                        request: 0,
                        tcp: 0,
                        tls: undefined,
                        total: 0,
                        wait: 0,
                      },
                    },
                  },
                  undefined
                )
              );
            },
          },
          logger,
        }).send(request);
      } catch (error) {
        expect(logger.debug).toHaveBeenCalledTimes(1);
        expect(logger.debug).toHaveBeenNthCalledWith(1, 'http_client_request', {
          request: {
            action: undefined,
            hostname: 'localhost',
            method: 'POST',
            port: 3000,
            protocol: 'http',
            url,
          },
        });
        expect(logger.log).toHaveBeenCalledTimes(1);
        expect(logger.log).toHaveBeenNthCalledWith(
          1,
          'error',
          'http_client_response',
          {
            error: {
              cause: undefined,
              message: '',
              name: 'HTTPResponseError',
              responseBody: undefined,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              stack: expect.stringContaining('Error:'),
            },
            request: {
              action: undefined,
              hostname: 'localhost',
              method: 'POST',
              port: 3000,
              protocol: 'http',
              url,
            },
            response: {
              contentEncoding: undefined,
              contentLength: undefined,
              contentType: undefined,
              duration: 0,
              retryCount: 0,
              statusCode: 500,
              timingPhases: {
                dns: 0,
                download: 0,
                firstByte: 0,
                request: 0,
                tcp: 0,
                tls: undefined,
                total: 0,
                wait: 0,
              },
            },
          }
        );
      }
    });

    it('should log request and request error on network error', async () => {
      const logger: Logger = {
        debug: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        log: jest.fn(),
        warn: jest.fn(),
        on: jest.fn(),
        end: jest.fn(),
      };
      const url = 'http://localhost:3000/api';
      const request: Request = {
        method: 'POST',
        url,
      };
      try {
        await createLoggingHTTPDecorator({
          http: {
            send: async () => {
              return Promise.reject(
                new HTTPRequestError(
                  'ETIMEDOUT',
                  new Error('The request timed out')
                )
              );
            },
          },
          logger,
          timer: {
            start: () => 2471576429548900n,
            stop: (value: bigint) => {
              return 2471750467315900n - value;
            },
          },
        }).send(request);
      } catch (error) {
        expect(logger.debug).toHaveBeenCalledTimes(1);
        expect(logger.debug).toHaveBeenNthCalledWith(1, 'http_client_request', {
          request: {
            action: undefined,
            hostname: 'localhost',
            method: 'POST',
            port: 3000,
            protocol: 'http',
            url,
          },
        });
        expect(logger.error).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenNthCalledWith(1, 'http_client_request', {
          error: {
            cause: new Error('The request timed out'),
            code: 'ETIMEDOUT',
            message: 'The request timed out',
            name: 'HTTPRequestError',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            stack: expect.stringContaining('Error: The request timed out'),
          },
          request: {
            action: undefined,
            hostname: 'localhost',
            method: 'POST',
            port: 3000,
            protocol: 'http',
            url,
          },
          response: {
            duration: 174037,
          },
        });
      }
    });
  });
});

const createLoggingHTTPDecorator = (options: {
  http: HTTP;
  logger: Logger;
  timer?: {
    start: () => bigint;
    stop: (value: bigint) => bigint;
  };
}): LoggingHTTPDecorator => {
  return new LoggingHTTPDecorator(
    options.http,
    options.logger,
    options.timer ?? timer
  );
};
