// Stryker disable all
import got from 'got/dist/source';
import type { Agent } from 'https';

import { HTTPRequestError, HTTPResponseError } from '../errors';

import { afterResponseHandler } from './afterResponseHandler';
import * as defaults from './defaults';
import { retryDelayCalculator } from './retryDelayCalculator';
import type { HTTP, Request, Response } from './types';

export class GotHTTP implements HTTP {
  constructor(
    private readonly instanceDefaults: {
      agent?: Agent;
      retryLimit: number;
    }
  ) {}

  async send(request: Request): Promise<Response> {
    return got({
      agent: {
        https: request.agent ?? this.instanceDefaults.agent,
      },
      body: request.body,
      form: request.form,
      headers: request.headers,
      hooks: {
        afterResponse: [afterResponseHandler(request)],
      },
      method: request.method,
      responseType: defaults.responseType,
      retry: {
        calculateDelay: retryDelayCalculator(
          request.backoff?.exponential?.factor ??
            defaults.retryExponentialFactor,
          request.backoff?.exponential?.noise ?? defaults.retryExponentialNoise
        ),
        errorCodes: defaults.retryErrorCodes,
        limit: request.retryLimit ?? this.instanceDefaults.retryLimit,
        methods: defaults.retryMethods,
        statusCodes: defaults.retryStatusCodes,
      },
      timeout: {
        request: request.requestTimeout ?? defaults.requestTimeout,
      },
      url: request.url,
    }).catch((error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.response === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        throw new HTTPRequestError(error.code, error);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        throw new HTTPResponseError(error.response, error);
      }
    });
  }
}
