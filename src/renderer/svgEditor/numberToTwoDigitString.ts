export const numberToTwoDigitString = (n: number): string => {
  if (n > 99 || n < 1) throw Error(`N must be between 1 and 99: ${n}`);
  if (n < 10) return `0${n.toString()}`;
  return n.toString();
};
