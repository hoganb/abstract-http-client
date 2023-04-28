import type { Logger } from '../logger';
import { timer } from '../util';

import type { HTTP } from '.';
import * as defaults from './defaults';
import { GotHTTP } from './GotHTTP';
import { keepAliveAgent } from './keepAliveAgent';
import { LoggingHTTPDecorator } from './LoggingHTTPDecorator';

export const getHTTP = (
  logger: Logger,
  keepAliveDisabled?: boolean,
  retryLimit?: number
): HTTP =>
  new LoggingHTTPDecorator(
    new GotHTTP({
      agent: keepAliveAgent(keepAliveDisabled ?? defaults.keepAliveDisabled),
      retryLimit: retryLimit ?? defaults.retryLimit,
    }),
    logger,
    timer
  );
