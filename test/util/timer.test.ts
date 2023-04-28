import { timer } from '../../src/util';

describe('timer', () => {
  it('start should return a bigint', () => {
    expect(typeof timer.start()).toEqual('bigint');
  });

  it('stop should return a bigint', () => {
    const start = timer.start();
    const stop = timer.stop(start);
    expect(typeof start).toEqual('bigint');
    expect(typeof stop).toEqual('bigint');
    expect(stop).toBeLessThan(start);
  });
});
