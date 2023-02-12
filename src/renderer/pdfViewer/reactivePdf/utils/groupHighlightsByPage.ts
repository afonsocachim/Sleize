import { HighlightViewport } from "main/database/schemas/highlightSchema";

export const groupHighlightsByPage = (highlights: HighlightViewport[]) => {
  return [...highlights].reduce((res, highlight) => {
    const { pageNumber } = highlight && highlight.position;

    res[pageNumber] = res[pageNumber] || [];
    if (highlight.content?.image) {
      res[pageNumber].push(highlight);
    } else {
      res[pageNumber].unshift(highlight);
    }

    return res;
  }, {} as { [x: number]: Array<HighlightViewport> });
};
