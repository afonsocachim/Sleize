import { ViewportPosition } from "main/database/schemas/highlightSchema";
import { pdfStore } from "../../pdfStore";
import { getPageFromRange } from "./pdfjsDom";
import { getClientRects } from "./getClientRects";
import { getBoundingRect } from "./getBoundingRect";

export const serializeToJSON = <T>(n: T): T => JSON.parse(JSON.stringify(n));

export const afterSelection = (range: Range) => {
  const { isCollapsed, setTipPosition } = pdfStore.getState();

  if (!range || isCollapsed) return;

  const page = getPageFromRange(range);

  if (!page) return;

  const rects = getClientRects(range, page.node);

  if (rects.length === 0) {
    return;
  }
  const originalPageDimensions = serializeToJSON(
    page.node.getBoundingClientRect()
  );

  const boundingRect = getBoundingRect(rects);

  const viewportPosition: ViewportPosition = {
    boundingRect,
    rects,
    pageNumber: page.number,
    originalPage: originalPageDimensions,
  };

  const content = {
    text: range.toString(),
  };

  const newHighlightPositionAndContent = {
    content,
    position: viewportPosition,
  };

  setTipPosition(viewportPosition);
  pdfStore.setState({ newHighlightPositionAndContent });
};
