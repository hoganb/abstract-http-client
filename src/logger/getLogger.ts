import memoize from 'fast-memoize';
import winston from 'winston';

import { LogLevel } from './logLevels';
import { logTransports } from './logTransports';
import type { Logger } from './types';

export const getLogger = memoize((): Logger => {
  return winston.createLogger({
    defaultMeta: {
      service: 'abstract-http-client',
    },
    exitOnError: false,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    level: LogLevel.DEBUG,
    transports: logTransports(),
  });
});
