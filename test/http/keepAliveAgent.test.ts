import { Agent } from 'https';

import * as defaults from '../../src/http/defaults';
import { keepAliveAgent } from '../../src/http/keepAliveAgent';

describe('keepAliveAgent', () => {
  it('should get the keep alive agent based on boolean', () => {
    expect(keepAliveAgent(false)).toBeInstanceOf(Agent);
    expect(keepAliveAgent(false)).toHaveProperty(
      'options',
      expect.objectContaining(defaults.httpsAgentOptions)
    );
    expect(keepAliveAgent(true)).toEqual(undefined);
  });
});
