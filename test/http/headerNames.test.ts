import { headerNames } from '../../src/http';

describe('headerNames', () => {
  it('should be defined', () => {
    expect(headerNames.contentEncoding).toEqual('content-encoding');
    expect(headerNames.contentLength).toEqual('content-length');
    expect(headerNames.contentType).toEqual('content-type');
  });
});
