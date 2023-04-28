import type { HTTPResponseError } from '../errors';
import { HTTPRequestError } from '../errors';
import type { Logger } from '../logger';
import type { Timer } from '../util';
import { hrtimeToMs, roundedNumber, stringToNumber } from '../util';

import type { HTTP, Request, Response } from '.';
import { headerNames } from '.';
import * as defaults from './defaults';
import * as logEvents from './logEvents';

export class LoggingHTTPDecorator implements HTTP {
  constructor(
    private readonly baseHTTP: HTTP,
    private readonly logger: Logger,
    private readonly timer: Timer
  ) {}

  public async send(request: Request): Promise<Response> {
    const url: URL = new URL(request.url);
    const requestMeta = {
      action: request.action,
      hostname: url.hostname,
      method: request.method,
      port: parseInt(
        url.port === '' ? (url.protocol === 'https:' ? '443' : '80') : url.port,
        10
      ),
      protocol: url.protocol.replace(':', ''),
      url: request.url,
    };
    this.logger.debug(logEvents.httpClientRequest, { request: requestMeta });
    const startTime: bigint = this.timer.start();
    try {
      const response: Response = await this.baseHTTP.send(request);
      this.logger.debug(logEvents.httpClientResponse, {
        request: requestMeta,
        response: {
          contentEncoding: response.headers[headerNames.contentEncoding],
          contentLength: stringToNumber(
            response.headers[headerNames.contentLength]
          ),
          contentType: response.headers[headerNames.contentType],
          duration: roundedNumber(response.timings?.phases.total),
          retryCount: response.retryCount,
          statusCode: response.statusCode,
          timingPhases: response.timings?.phases,
        },
      });
      return response;
    } catch (error) {
      if (error instanceof HTTPRequestError) {
        this.logger.error(logEvents.httpClientRequest, {
          error: error.logData,
          request: requestMeta,
          response: {
            duration: hrtimeToMs(this.timer.stop(startTime)),
          },
        });
      } else {
        const response: Response = (error as HTTPResponseError).response;
        this.logger.log(
          request.responseErrorLogLevel ?? defaults.responseErrorLogLevel,
          logEvents.httpClientResponse,
          {
            error: (error as HTTPResponseError).logData,
            request: requestMeta,
            response: {
              contentEncoding: response.headers[headerNames.contentEncoding],
              contentLength: stringToNumber(
                response.headers[headerNames.contentLength]
              ),
              contentType: response.headers[headerNames.contentType],
              duration: roundedNumber(response.timings?.phases.total),
              retryCount: response.retryCount,
              statusCode: response.statusCode,
              timingPhases: response.timings?.phases,
            },
          }
        );
      }
      throw error;
    }
  }
}
