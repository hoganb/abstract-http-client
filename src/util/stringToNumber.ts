/**
 * Converts a string to an integer. Defaults NaN to undefined.
 *
 * @param value - A string to convert into a number
 * @returns The converted number
 */
export const stringToNumber = (
  value: string | undefined
): number | undefined => {
  const parsed: number = parseInt(value as string, 10);
  return isNaN(parsed) ? undefined : parsed;
};
