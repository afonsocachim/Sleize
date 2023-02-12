export type OptionsHotkey = {
  alt?: true;
  ctrl?: true;
  shift?: true;
  key: CapitalLetter | SingleDigitNumber;
};

export const isHotkey = (e: KeyboardEvent, options: OptionsHotkey) => {
  let keyString = "";
  if (!options.key) throw Error("no key");
  if (typeof options.key === "string") keyString = `Key${options.key}`;
  if (typeof options.key === "number") keyString = `Digit${options.key}`;
  if (e.code !== keyString) return false;
  if ((options.alt && !e.altKey) || (!options.alt && e.altKey)) return false;
  if (
    (options.ctrl && !(e.ctrlKey || e.metaKey)) ||
    (!options.ctrl && (e.ctrlKey || e.metaKey))
  )
    return false;
  if ((options.shift && !e.shiftKey) || (!options.shift && e.shiftKey))
    return false;
  return true;
};

export type SingleDigitNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type CapitalLetter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";
