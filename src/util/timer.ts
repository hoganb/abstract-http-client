import type { Timer } from '.';

export const timer: Timer = {
  start: () => process.hrtime.bigint(),
  stop: (value: bigint) => {
    return process.hrtime.bigint() - value;
  },
};
