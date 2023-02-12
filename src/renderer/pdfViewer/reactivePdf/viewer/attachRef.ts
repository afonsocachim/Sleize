import { viewerObject } from "./viewerObject";
import { onDocumentReady } from "./onDocumentReady";
import { renderHighlights } from "../components/renderHighlights/renderHighlights";
import { onSelectionChange } from "./onSelectionChange";
import { handleKeyDown } from "../utils/hideTipHandlers";
import { debouncedScaleValue } from "./handleScaleValue";

export const attachRef = (ref: HTMLDivElement | null) => {
  if (ref) {
    const observer = viewerObject.resizeObserver;
    viewerObject.containerNode = ref;
    viewerObject.unsubscribe();
    const { ownerDocument: doc } = ref;
    viewerObject.eventBus.on("textlayerrendered", renderHighlights);
    viewerObject.eventBus.on("pagesinit", () => onDocumentReady(viewerObject));
    doc.addEventListener("selectionchange", onSelectionChange);
    doc.addEventListener("keydown", handleKeyDown);
    if (doc.defaultView)
      doc.defaultView.addEventListener("resize", debouncedScaleValue);
    if (observer) observer.observe(ref);

    viewerObject.unsubscribe = () => {
      viewerObject.eventBus.off("pagesinit", () =>
        onDocumentReady(viewerObject)
      );
      viewerObject.eventBus.off("textlayerrendered", renderHighlights);
      doc.removeEventListener("selectionchange", onSelectionChange);
      doc.removeEventListener("keydown", handleKeyDown);
      if (doc.defaultView)
        doc.defaultView.removeEventListener("resize", debouncedScaleValue);
      if (observer) observer.disconnect();
    };
  }
};
