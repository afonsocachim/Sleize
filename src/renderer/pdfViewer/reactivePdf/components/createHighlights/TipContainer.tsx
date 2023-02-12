import React from "react";
import { renderStore } from "renderer/pdfViewer/reactivePdf/renderStore";
import { CommentCard } from "../renderHighlights/CommentCard";
import { CreateHighlight } from "./CreateHighlight";

const clamp = (value: number, left: number, right: number) =>
  Math.min(Math.max(value, left), right);

type StyleType = {
  left: number;
  top: number;
  bottom: number;
};

export default function TipContainer({
  style,
  scrollTop,
  pageBoundingRect,
}: {
  style: StyleType;
  scrollTop: number;
  pageBoundingRect: DOMRect;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);
  const [width, setWidth] = React.useState(0);

  const updatePosition = React.useCallback(() => {
    const container = containerRef.current;

    if (!container) return;
    const { offsetHeight, offsetWidth } = container;
    setHeight(offsetHeight);
    setWidth(offsetWidth);
  }, []);

  const isStyleCalculationInProgress = width === 0 && height === 0;

  const shouldMove = style.top - height - 5 < scrollTop;

  const top = shouldMove ? style.bottom + 5 : style.top - height - 5;

  const left = clamp(style.left - width / 2, 0, pageBoundingRect.width - width);

  const onUpdate = () => {
    setHeight(0);
    setWidth(0);
    updatePosition();
  };

  const editHighlight = renderStore((s) => s.highlight);

  return (
    <div
      className="PdfHighlighter__tip-container"
      style={{
        visibility: isStyleCalculationInProgress ? "hidden" : "visible",
        top,
        left,
      }}
      ref={containerRef}
    >
      {editHighlight ? (
        <CommentCard onUpdate={onUpdate} highlight={editHighlight} />
      ) : (
        <CreateHighlight onUpdate={onUpdate} />
      )}
    </div>
  );
}
