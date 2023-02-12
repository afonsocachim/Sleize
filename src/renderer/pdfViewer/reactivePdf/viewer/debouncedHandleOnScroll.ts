import { debounce } from "lodash";
import { viewerObject } from "./viewerObject";
import { pdfToolbarStore } from "../../pdfToolbarStore";

const handleOnScroll = () => {
  const {
    MaxPageNumber,
    setMaxPageNumber,
    CurrentPageNumber,
    setCurrentPageNumber,
  } = pdfToolbarStore.getState();

  if (!viewerObject.viewer)
    throw Error("Invalid user object at handle on scroll");
  if (typeof viewerObject.viewer.pagesCount === "number") {
    const { pagesCount } = viewerObject.viewer;
    if (pagesCount > 0 && pagesCount !== MaxPageNumber) {
      setMaxPageNumber(pagesCount);
    }
  }
  if (typeof viewerObject.viewer?.currentPageNumber === "number") {
    const { currentPageNumber } = viewerObject.viewer;
    if (currentPageNumber > 0 && currentPageNumber !== CurrentPageNumber) {
      setCurrentPageNumber(currentPageNumber, "scrolled");
    }
  }
};
export const debouncedHandleOnScroll = debounce(handleOnScroll, 100);

// let height;
// if (
//   typeof viewerObject.viewer?.getPageView(1)?.height === "number" &&
//   viewerObject.viewer?.getPageView(1)?.height > 0
// ) {
//   height = viewerObject.viewer?.getPageView(1)?.height;
// }
// let width;
// if (
//   typeof viewerObject.viewer?.getPageView(1)?.width === "number" &&
//   viewerObject.viewer?.getPageView(1)?.width > 0
// ) {
//   width = viewerObject.viewer?.getPageView(1)?.width;
// }
// let newScale;
// if (height && width) {
//   newScale = width / height;
// }
// if (newScale !== FitToPagePercent) {
//   setFitToPagePercent(Math.round(newScale * 95));
// }
