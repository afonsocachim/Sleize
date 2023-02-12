import { pdfStore } from "renderer/pdfViewer/pdfStore";
import { scrollTo } from "./scrollTo";

export const scrollToHighlight = (id: string) => {
  const { highlights } = pdfStore.getState();
  const highlightToScroll = highlights.find((highlight) => highlight.id === id);

  if (highlightToScroll) {
    scrollTo(highlightToScroll);
  }
};
