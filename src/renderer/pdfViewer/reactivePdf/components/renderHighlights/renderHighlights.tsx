import ReactDom from "react-dom";
import { LTWH } from "main/database/schemas/highlightSchema";
import { pdfStore } from "../../../pdfStore";
import { pdfToolbarStore } from "../../../pdfToolbarStore";
import { groupHighlightsByPage } from "../../utils/groupHighlightsByPage";
import { findOrCreateHighlightLayer } from "../../viewer/findOrCreateHighlightLayer";
import { viewerObject } from "../../viewer/viewerObject";
import { HighlightTransform } from "./HighlightTransform";
import { screenshot } from "../../viewer/screenshot";
import { scaleHighlightToPage } from "./scaleHighlight";
import { getPageFromElement } from "../../utils/pdfjsDom";

export const renderHighlights = () => {
  const { pdfDocument, showTip, idScrolledTo, tip, highlights } =
    pdfStore.getState();

  const highlightsByPage = groupHighlightsByPage(highlights);

  if (!pdfDocument)
    throw Error(
      "Can't render highlights on a undefined pdfDocument, at RenderHighlights"
    );

  for (
    let pageNumber = 1;
    pageNumber <= pdfDocument.numPages;
    pageNumber += 1
  ) {
    const highlightLayer = findOrCreateHighlightLayer(pageNumber, viewerObject);
    if (!highlightLayer) return;
    const pageHighlights = highlightsByPage[pageNumber] || [];
    const page = getPageFromElement(highlightLayer as HTMLElement);
    if (!page) return;
    const currentPageDimensions = page.node.getBoundingClientRect();

    ReactDom.render(
      <div>
        {pageHighlights.map((pageHighlight, index) => {
          const pageRatio =
            currentPageDimensions.height /
            pageHighlight.position.originalPage.height;
          const viewportHighlight = scaleHighlightToPage(
            pageHighlight,
            pageRatio
          );

          const { id } = viewportHighlight;
          if (tip && tip.highlight.id === String(id)) {
            showTip(tip.highlight);
          }

          const isScrolledTo = Boolean(idScrolledTo === id);

          const takeScreenshot = (boundingRect: LTWH) =>
            screenshot(boundingRect, pageNumber, viewerObject);

          return (
            <HighlightTransform
              key={id}
              highlight={viewportHighlight}
              index={index}
              isScrolledTo={isScrolledTo}
              takeScreenshot={takeScreenshot}
            />
          );
        })}
      </div>,
      highlightLayer
    );
  }
};
