import { HTTPRequestError } from '../../src/errors';

describe('HTTPRequestError', () => {
  it('should provide the correct log data', () => {
    const error = new HTTPRequestError(
      'ETIMEDOUT',
      new Error('The request timed out')
    );
    expect(error.code).toEqual('ETIMEDOUT');
    expect(error.message).toEqual('The request timed out');
    expect(error.logData).toMatchObject({
      code: 'ETIMEDOUT',
      name: 'HTTPRequestError',
      message: 'The request timed out',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stack: expect.stringContaining('Error: The request timed out'),
    });
  });
});
