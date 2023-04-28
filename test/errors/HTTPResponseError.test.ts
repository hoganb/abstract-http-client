import { HTTPResponseError } from '../../src/errors';

describe('HTTPResponseError', () => {
  it('should provide the correct log data with empty response body', () => {
    const jsonParse = jest.spyOn(JSON, 'parse');
    const error = new HTTPResponseError(
      { body: Buffer.alloc(0), headers: {}, statusCode: 500 },
      new Error('500 Internal Server Error')
    );
    expect(error.message).toEqual('500 Internal Server Error');
    expect(error.logData).toMatchObject({
      responseBody: undefined,
      name: 'HTTPResponseError',
      message: '500 Internal Server Error',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stack: expect.stringContaining('Error: 500 Internal Server Error'),
    });
    expect(jsonParse).toBeCalledTimes(0);
  });

  it('should provide the correct log data with empty application/json response body', () => {
    const jsonParse = jest.spyOn(JSON, 'parse');
    const error = new HTTPResponseError(
      {
        body: Buffer.alloc(0),
        headers: { 'content-type': 'application/json' },
        statusCode: 500,
      },
      new Error('500 Internal Server Error')
    );
    expect(error.message).toEqual('500 Internal Server Error');
    expect(error.logData).toMatchObject({
      responseBody: undefined,
      name: 'HTTPResponseError',
      message: '500 Internal Server Error',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stack: expect.stringContaining('Error: 500 Internal Server Error'),
    });
    expect(jsonParse).toBeCalledTimes(0);
  });

  it('should provide the correct log data with application/json response body', () => {
    const error = new HTTPResponseError(
      {
        body: Buffer.from(
          JSON.stringify({ error: { message: 'validation error' } }),
          'utf-8'
        ),
        headers: { 'content-type': 'application/json' },
        statusCode: 400,
      },
      new Error('400 Bad Request')
    );
    expect(error.message).toEqual('400 Bad Request');
    expect(error.logData).toMatchObject({
      responseBody: { error: { message: 'validation error' } },
      name: 'HTTPResponseError',
      message: '400 Bad Request',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stack: expect.stringContaining('Error: 400 Bad Request'),
    });
  });

  it('should provide the correct log data with malformed application/json response body', () => {
    const error = new HTTPResponseError(
      {
        body: Buffer.from('invalid JSON input', 'utf-8'),
        headers: { 'content-type': 'application/json' },
        statusCode: 400,
      },
      new Error('400 Bad Request')
    );
    expect(error.message).toEqual('400 Bad Request');
    expect(error.logData).toMatchObject({
      responseBody: undefined,
      name: 'HTTPResponseError',
      message: '400 Bad Request',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stack: expect.stringContaining('Error: 400 Bad Request'),
    });
  });

  it('should provide the correct log data with non-application/json response body', () => {
    const error = new HTTPResponseError(
      {
        body: Buffer.from(
          JSON.stringify({ error: { message: 'validation error' } }),
          'utf-8'
        ),
        headers: {},
        statusCode: 400,
      },
      new Error('400 Bad Request')
    );
    expect(error.message).toEqual('400 Bad Request');
    expect(error.logData).toMatchObject({
      responseBody: undefined,
      name: 'HTTPResponseError',
      message: '400 Bad Request',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stack: expect.stringContaining('Error: 400 Bad Request'),
    });
  });
});
