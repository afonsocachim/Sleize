import { getAreaAsPNG } from "../utils/getAreaAsPNG";
import { ViewerObject } from "./viewerObject";
import { LTWH } from "../../../../main/database/schemas/highlightSchema";

export const screenshot = (
  position: LTWH,
  pageNumber: number,
  viewerObject: ViewerObject
) => {
  if (!viewerObject.viewer)
    throw Error("No viewer object passed to scaledPositionToViewport");
  const { canvas } = viewerObject.viewer.getPageView(pageNumber - 1);

  return getAreaAsPNG(canvas, position);
};
