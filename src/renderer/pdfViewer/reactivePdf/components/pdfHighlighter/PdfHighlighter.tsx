import React from "react";
import "pdfjs-dist/web/pdf_viewer.css";
import "./PdfHighlighter.css";
import { pdfToolbarStore } from "renderer/pdfViewer/pdfToolbarStore";
import { MouseSelection } from "../mouseSelection/MouseSelection";
import { pdfStore } from "../../../pdfStore";
import { onMouseDown } from "../../utils/hideTipHandlers";
import { debouncedScaleValue } from "../../viewer/handleScaleValue";
import { viewerObject } from "../../viewer/viewerObject";
import { attachRef } from "../../viewer/attachRef";
import { RenderTipContainer } from "../createHighlights/RenderTipContainer";
import { initializeViewer } from "../../viewer/initializeViewer";
import { debouncedHandleOnScroll } from "../../viewer/debouncedHandleOnScroll";
import { renderHighlights } from "../renderHighlights/renderHighlights";

export default function PdfHighlighter() {
  // pdfHighlighterStore
  const pdfDocument = pdfStore((state) => state.pdfDocument);
  const highlights = pdfStore((s) => s.highlights);
  const tipPosition = pdfStore((s) => s.tipPosition);
  const zoom = pdfToolbarStore((s) => s.CurrentPageScalePercent);

  React.useEffect(() => {
    if (pdfDocument) initializeViewer(pdfDocument, viewerObject);
    if (typeof ResizeObserver !== "undefined") {
      viewerObject.resizeObserver = new ResizeObserver(debouncedScaleValue);
    }
    return () => {
      viewerObject.unsubscribe();
      viewerObject.resizeObserver = undefined;
    };
  }, [pdfDocument]);

  React.useEffect(() => {
    renderHighlights();
  }, [highlights, zoom]);

  return (
    <div onPointerDown={onMouseDown}>
      <div
        ref={attachRef}
        className="PdfHighlighter"
        onContextMenu={(e) => e.preventDefault()}
        onScroll={debouncedHandleOnScroll}
      >
        <div className="pdfViewer" />
        <RenderTipContainer
          tipPosition={tipPosition}
          viewerObject={viewerObject}
        />
        <MouseSelection />
      </div>
    </div>
  );
}
