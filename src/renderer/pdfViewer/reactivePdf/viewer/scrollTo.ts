import { HighlightViewport } from "main/database/schemas/highlightSchema";
import { viewerObject } from "./viewerObject";
import { emptyId } from "../utils/emptyId";
import { pdfStore } from "../../pdfStore";

const { setIdScrolledTo: setScrolledToHighlightId } = pdfStore.getState();

export const onScroll = () => {
  if (!viewerObject.viewer)
    throw Error("Viewer object with no viewer passed to scrollTo");

  setScrolledToHighlightId(emptyId);

  viewerObject.viewer.container.removeEventListener("scroll", onScroll);
};

export const scrollTo = (highlight: HighlightViewport) => {
  const { pageNumber, boundingRect } = highlight.position;
  if (!viewerObject.viewer)
    throw Error("Viewer object with no viewer passed to scrollTo");

  viewerObject.viewer.container.removeEventListener("scroll", onScroll);

  const pageViewport = viewerObject.viewer.getPageView(pageNumber - 1).viewport;

  const scrollMargin = 10;

  viewerObject.viewer.scrollPageIntoView({
    pageNumber,
    destArray: [
      null,
      { name: "XYZ" },
      ...pageViewport.convertToPdfPoint(0, boundingRect.top - scrollMargin),
      0,
    ],
  });

  setScrolledToHighlightId(highlight.id);

  // wait for scrolling to finish
  setTimeout(() => {
    if (!viewerObject.viewer)
      throw Error("Viewer object with no viewer passed to scrollTo");
    viewerObject.viewer.container.addEventListener("scroll", onScroll);
  }, 100);
};
