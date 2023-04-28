import {
  httpsAgentOptions,
  keepAliveDisabled,
  requestTimeout,
  responseType,
  retryErrorCodes,
  retryExponentialFactor,
  retryExponentialNoise,
  retryLimit,
  retryMethods,
  retryStatusCodes,
} from '../../src/http/defaults';

describe('defaults', () => {
  it('should be defined', () => {
    expect(httpsAgentOptions).toEqual({
      ciphers: 'HIGH',
      keepAlive: true,
      keepAliveMsecs: 1000,
      maxFreeSockets: 256,
      maxSockets: Infinity,
      minVersion: 'TLSv1.2',
      timeout: 30000,
    });
    expect(keepAliveDisabled).toEqual(false);
    expect(requestTimeout).toEqual(60 * 1000);
    expect(responseType).toEqual('buffer');
    expect(retryErrorCodes).toEqual([
      'ETIMEDOUT',
      'ECONNRESET',
      'EADDRINUSE',
      'ECONNREFUSED',
      'EPIPE',
      'ENOTFOUND',
      'ENETUNREACH',
      'EAI_AGAIN',
    ]);
    expect(retryExponentialFactor).toEqual(1000);
    expect(retryExponentialNoise).toEqual(100);
    expect(retryLimit).toEqual(5);
    expect(retryMethods).toEqual([
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'HEAD',
      'OPTIONS',
      'PATCH',
    ]);
    expect(retryStatusCodes).toEqual([
      408, 413, 429, 500, 502, 503, 504, 521, 522, 524,
    ]);
  });
});
