import { asElement, isHTMLElement } from "./pdfjsDom";
import { pdfStore } from "../../pdfStore";

export const onMouseDown = (event: React.MouseEvent<HTMLElement>) => {
  if (!isHTMLElement(event.target)) {
    return;
  }

  if (asElement(event.target).closest(".PdfHighlighter__tip-container")) {
    return;
  }

  pdfStore.getState().hideTipAndSelection();
};

export const handleKeyDown = (event: KeyboardEvent) => {
  if (event.code === "Escape") {
    pdfStore.getState().hideTipAndSelection();
  }
};
