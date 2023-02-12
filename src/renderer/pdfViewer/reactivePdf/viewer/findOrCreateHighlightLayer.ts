import { ViewerObject } from "./viewerObject";
import { findOrCreateContainerLayer } from "../utils/pdfjsDom";

export const findOrCreateHighlightLayer = (
  page: number,
  viewerObject: ViewerObject
) => {
  if (!viewerObject.viewer) return null;
  const { textLayer } = viewerObject.viewer.getPageView(page - 1) || {};

  if (!textLayer) return null;

  return findOrCreateContainerLayer(
    textLayer.textLayerDiv,
    "PdfHighlighter__highlight-layer"
  );
};
