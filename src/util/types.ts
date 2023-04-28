export type Timer = {
  start: () => bigint;
  stop: (value: bigint) => bigint;
};
