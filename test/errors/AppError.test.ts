import { AppError } from '../../src/errors';

describe('AppError', () => {
  it('should be constructable from an optional message and cause', () => {
    const error1 = new AppError();
    expect(error1.message).toEqual('');
    expect(error1.logData).toEqual({
      cause: undefined,
      message: '',
      name: 'AppError',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stack: expect.stringContaining('Error:'),
    });

    const error2 = new AppError('MESSAGE');
    expect(error2.message).toEqual('MESSAGE');
    expect(error2.logData).toEqual({
      cause: undefined,
      message: 'MESSAGE',
      name: 'AppError',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stack: expect.stringContaining('Error: MESSAGE'),
    });

    const error3 = new AppError('MESSAGE', 'CAUSE');
    expect(error3.message).toEqual('MESSAGE');
    expect(error3.cause).toEqual('CAUSE');
    expect(error3.logData).toEqual({
      cause: 'CAUSE',
      message: 'MESSAGE',
      name: 'AppError',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stack: expect.stringContaining('Error: MESSAGE'),
    });

    const error4 = new AppError(undefined, 'CAUSE');
    expect(error4.message).toEqual('CAUSE');
    expect(error4.logData).toEqual({
      cause: 'CAUSE',
      message: 'CAUSE',
      name: 'AppError',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stack: expect.stringContaining('Error: CAUSE'),
    });

    const cause5 = new Error('MESSAGE');
    const error5 = new AppError(undefined, cause5);
    expect(error5.message).toEqual('MESSAGE');
    expect(error5.cause).toEqual(cause5);
    expect(error5.logData).toEqual({
      cause: cause5,
      message: 'MESSAGE',
      name: 'AppError',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stack: expect.stringContaining('Error: MESSAGE'),
    });
  });
});
