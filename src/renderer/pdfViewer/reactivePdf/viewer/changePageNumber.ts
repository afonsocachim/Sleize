import { viewerObject } from "./viewerObject";

export const changePageNumber = (pageNumber: number) => {
  const pageViewport = viewerObject.viewer?.getPageView(
    pageNumber - 1
  )?.viewport;
  if (pageViewport && viewerObject.viewer) {
    viewerObject.viewer.scrollPageIntoView({
      pageNumber,
      destArray: [
        null,
        { name: "XYZ" },
        ...pageViewport.convertToPdfPoint(0, 0),
        0,
      ],
    });
  }
};
