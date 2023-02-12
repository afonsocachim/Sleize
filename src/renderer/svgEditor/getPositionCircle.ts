import { SvgObject } from "./types";

export const getPositionCircle = (obj: SvgObject) => {
  let x = 0;
  let y = 0;
  let w = 0;
  let h = 0;

  if (obj.xStart < obj.xEnd) {
    x = obj.xStart;
    w = obj.xEnd - obj.xStart;
  } else {
    x = obj.xEnd;
    w = obj.xStart - obj.xEnd;
  }

  if (obj.yStart < obj.yEnd) {
    y = obj.yStart;
    h = obj.yEnd - obj.yStart;
  } else {
    y = obj.yEnd;
    h = obj.yStart - obj.yEnd;
  }

  return { x, y, w, h };
};
