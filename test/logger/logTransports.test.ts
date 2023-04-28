import { logTransports } from '../../src/logger/logTransports';

import 'fs';
jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn().mockResolvedValue(''),
    readFile: jest.fn().mockResolvedValue(''),
  },
  existsSync: jest.fn(),
  stat: jest.fn(),
  mkdirSync: jest.fn(),
}));

describe('logTransports', () => {
  it('should default to a console log transport with formatting', () => {
    const transports = logTransports();
    expect(transports).toHaveLength(2);
    expect((transports[0] as unknown as Record<string, unknown>).name).toEqual(
      'console'
    );
    expect((transports[1] as unknown as Record<string, unknown>).name).toEqual(
      'file'
    );
    expect(
      transports[0].format as unknown as Record<string, unknown>
    ).toMatchObject({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      Format: expect.any(Function),
      options: {},
    });
  });

  it('should create file logger to log dir and with known filename', () => {
    const transports = logTransports();
    expect(transports).toHaveLength(2);
    expect((transports[1] as unknown as Record<string, unknown>).name).toEqual(
      'file'
    );
    expect(transports[1] as unknown as Record<string, unknown>).toMatchObject({
      dirname: 'logs',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      filename: expect.stringMatching(/.*\.log/),
    });
    expect(
      (transports[1] as unknown as Record<string, unknown>).filename
    ).not.toEqual('winston.log');
  });
});
