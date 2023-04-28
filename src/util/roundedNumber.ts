/**
 * Returns a supplied numeric expression rounded to the nearest integer. Defaults NaN to undefined.
 *
 * @param value - The number to round
 * @returns The rounded number
 */
export const roundedNumber = (
  value: number | undefined
): number | undefined => {
  const parsed: number = Math.round(value as number);
  return isNaN(parsed) ? undefined : parsed;
};
