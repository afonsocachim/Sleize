import { LTWH } from "../../../../../main/database/schemas/highlightSchema";

export type XY = {
  x: number;
  y: number;
};

export const getBoundingRect = (start: XY, end: XY): LTWH => {
  return {
    left: Math.min(end.x, start.x),
    top: Math.min(end.y, start.y),

    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
};

export const shouldRender = (boundingRect: LTWH) => {
  return boundingRect.width >= 1 && boundingRect.height >= 1;
};

export const containerCoords = (
  pageX: number,
  pageY: number,
  container: HTMLElement
) => {
  const containerBoundingRect = container.getBoundingClientRect();

  return {
    x: pageX - containerBoundingRect.left + container.scrollLeft,
    y: pageY - containerBoundingRect.top + container.scrollTop - window.scrollY,
  };
};
