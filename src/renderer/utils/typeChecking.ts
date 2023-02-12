export const isArray1 = (array: unknown): boolean | never => {
  if (Array.isArray(array) && array.length > 0) return true;
  return false;
};

export const isString1 = (string: unknown): boolean | never => {
  if (typeof string === "string" && string.length > 0) return true;
  return false;
};

export const isNumber1 = (number: unknown): boolean | never => {
  if (typeof number === "number" && Number.isInteger(number) && number > 0)
    return true;
  return false;
};
