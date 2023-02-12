import { LTWH } from "main/database/schemas/highlightSchema";

export const getBoundingRect = (clientRects: LTWH[]): LTWH => {
  const rectArray = Array.from(clientRects);
  const filtered = rectArray.filter((r) => !(r.left === 0 && r.width === 0));
  const validArray = filtered.length > 0 ? filtered : rectArray;
  const rects = validArray.map((rect) => {
    const { left, top, width, height } = rect;

    const X0 = left;
    const X1 = left + width;

    const Y0 = top;
    const Y1 = top + height;

    return { X0, X1, Y0, Y1 };
  });

  const optimal = rects.reduce((prev, curr) => {
    return {
      X0: Math.min(prev.X0, curr.X0),
      X1: Math.max(prev.X1, curr.X1),

      Y0: Math.min(prev.Y0, curr.Y0),
      Y1: Math.max(prev.Y1, curr.Y1),
    };
  }, rects[0]);

  const { X0, X1, Y0, Y1 } = optimal;

  const boundingRect = {
    left: X0,
    top: Y0,
    width: X1 - X0,
    height: Y1 - Y0,
  };

  return boundingRect;
};
