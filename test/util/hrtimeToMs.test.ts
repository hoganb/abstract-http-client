import { hrtimeToMs } from '../../src/util';

describe('hrtimeToMs', () => {
  it('should convert bigint to ms number', () => {
    expect(hrtimeToMs(2471750467315900n - 2471576429548900n)).toEqual(174037);
  });
});
