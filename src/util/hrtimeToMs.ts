/**
 * Converts high-resolution time to milliseconds.
 *
 * @param value - The high-resolution time in nanoseconds as a bigint to convert to ms
 * @returns The converted number in ms
 */
export const hrtimeToMs = (value: bigint): number => {
  return Number(value / BigInt(1000000));
};
