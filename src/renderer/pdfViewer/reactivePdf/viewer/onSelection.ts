import { LTWH, ViewportPosition } from "main/database/schemas/highlightSchema";
import { getPageFromElement } from "../utils/pdfjsDom";
import { viewerObject } from "./viewerObject";
import { screenshot } from "./screenshot";
import { pdfStore } from "../../pdfStore";
import { serializeToJSON } from "../utils/afterSelection";

export const onSelection = (startTarget: HTMLElement, boundingRect: LTWH) => {
  const page = getPageFromElement(startTarget);

  if (!page) {
    return;
  }

  const pageBoundingRect = {
    ...boundingRect,
    top: boundingRect.top - page.node.offsetTop,
    left: boundingRect.left - page.node.offsetLeft,
  };
  const originalPageDimensions = serializeToJSON(
    page.node.getBoundingClientRect()
  );

  const viewportPosition: ViewportPosition = {
    boundingRect: pageBoundingRect,
    rects: [],
    pageNumber: page.number,
    originalPage: originalPageDimensions,
  };

  const image = screenshot(pageBoundingRect, page.number, viewerObject);

  const { setTipPosition } = pdfStore.getState();

  const content = { image };

  const newHighlightPositionAndContent = {
    content,
    position: viewportPosition,
  };

  setTipPosition(viewportPosition);
  pdfStore.setState({ newHighlightPositionAndContent });
};
