import { Agent } from 'https';

import * as defaults from './defaults';

export const keepAliveAgent = (keepAliveDisabled: boolean): Agent | undefined =>
  keepAliveDisabled ? undefined : new Agent(defaults.httpsAgentOptions);
