/* eslint-disable no-bitwise */
export const binarySearch = <T>(array: Array<T>, pred: (f: T) => boolean) => {
  let lo = -1;
  let hi = array.length;
  while (1 + lo < hi) {
    const mi = lo + ((hi - lo) >> 1);
    if (pred(array[mi])) {
      hi = mi;
    } else {
      lo = mi;
    }
  }
  return hi;
};
