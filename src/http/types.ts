import type { IncomingHttpHeaders } from 'http';
import type { Agent } from 'https';

import type { LogLevel } from '../logger';

export interface HTTP {
  send: (request: Request) => Promise<Response>;
}

export type Method =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'HEAD'
  | 'DELETE'
  | 'OPTIONS'
  | 'TRACE';

export type Request = {
  /**
   * Human readable action of request used for logging e.g. createTransaction
   */
  action?: string;
  /**
   * Request `Agent` behavior
   */
  agent?: Agent;
  /**
   * Request backoff strategies
   */
  backoff?: {
    exponential?: {
      factor?: number;
      noise?: number;
    };
  };
  /**
   * Request body parameters in string or buffer format
   */
  body?: string | Buffer;
  /**
   * Request form parameters
   */
  form?: Record<string, unknown>;
  /**
   * Request header parameters
   */
  headers?: Record<string, string | undefined>;
  /**
   * Request HTTP method to use e.g. GET, POST etc
   */
  method: Method;
  /**
   * Opportunity to amend the request on response error for retry i.e. 401 Unauthorized + refresh token
   */
  onResponseError?: (
    response: Response
  ) => Promise<Record<string, unknown> | undefined>;
  /**
   * Request timeout in ms, defaults to `60000` milliseconds
   */
  requestTimeout?: number;
  /**
   * Response error log level, defaults to `ERROR`
   */
  responseErrorLogLevel?: LogLevel;
  /**
   * Request retry limit, defaults to `5`
   */
  retryLimit?: number;
  /**
   * Request URL
   */
  url: string;
};

export type Response = {
  /**
   * Response body in buffer format
   */
  body: Buffer;
  /**
   * Response headers
   */
  headers: IncomingHttpHeaders;
  /**
   * The number of times the request was retried before responding
   */
  retryCount?: number;
  /**
   * Response HTTP status code
   */
  statusCode: number;
  /**
   * Response timings
   */
  timings?: {
    start?: number;
    socket?: number;
    lookup?: number;
    connect?: number;
    secureConnect?: number;
    upload?: number;
    response?: number;
    end?: number;
    error?: number;
    abort?: number;
    phases: {
      dns?: number;
      download?: number;
      firstByte?: number;
      request?: number;
      tcp?: number;
      tls?: number;
      total?: number;
      wait?: number;
    };
  };
};
