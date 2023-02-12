import { HighlightViewport, LTWH } from "main/database/schemas/highlightSchema";

export const scaleLTWHP = (p: LTWH, r: number) => {
  return {
    left: p.left * r,
    top: p.top * r,
    width: p.width * r,
    height: p.height * r,
  };
};

export const scaleHighlightToPage = (h: HighlightViewport, ratio: number) => {
  const { position } = h;
  const { boundingRect, rects } = position;
  const newBoundingRect = scaleLTWHP(boundingRect, ratio);
  const newRects = rects.map((rect) => scaleLTWHP(rect, ratio));
  const newPosition = {
    ...position,
    boundingRect: newBoundingRect,
    rects: newRects,
  };
  const newHighlight = { ...h, position: newPosition };
  return newHighlight;
};
