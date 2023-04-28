import type { AgentOptions } from 'https';

import { LogLevel } from '../logger';
import type { Method } from '.';

export const httpsAgentOptions: AgentOptions = {
  ciphers: 'HIGH',
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxFreeSockets: 256,
  maxSockets: Infinity,
  minVersion: 'TLSv1.2',
  timeout: 30000,
};
export const keepAliveDisabled = false;
export const requestTimeout = 60 * 1000;
export const responseType = 'buffer';
export const retryErrorCodes: string[] = [
  'ETIMEDOUT',
  'ECONNRESET',
  'EADDRINUSE',
  'ECONNREFUSED',
  'EPIPE',
  'ENOTFOUND',
  'ENETUNREACH',
  'EAI_AGAIN',
];
export const retryExponentialFactor = 1000;
export const retryExponentialNoise = 100;
export const retryLimit = 5;
export const retryMethods: Method[] = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'HEAD',
  'OPTIONS',
  'PATCH',
];
export const retryStatusCodes: number[] = [
  408, 413, 429, 500, 502, 503, 504, 521, 522, 524,
];
export const responseErrorLogLevel = LogLevel.ERROR;
