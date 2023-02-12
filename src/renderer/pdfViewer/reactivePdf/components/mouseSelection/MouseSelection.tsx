import React from "react";
import { styled } from "@mui/system";
import { asElement, isHTMLElement } from "../../utils/pdfjsDom";
import {
  getBoundingRect,
  shouldRender,
  containerCoords,
  XY,
} from "./mouseSelectionHelpers";
import { onSelection } from "../../viewer/onSelection";
import { toggleTextSelection } from "../../viewer/toggleTextSelection";
import { enableAreaSelection } from "../../utils/enableAreaSelection";
import { pdfStore } from "../../../pdfStore";

const SelectionDiv = styled("div")`
  position: absolute;
  border: 1px dashed #333;
  background: rgba(252, 232, 151, 1);
  mix-blend-mode: multiply;
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    opacity: 0.5;
  }
`;

export const MouseSelection = () => {
  const [start, setStart] = React.useState<XY | null>(null);
  const [end, setEnd] = React.useState<XY | null>(null);

  const mounted = React.useRef<boolean>(false);
  const root = React.createRef<HTMLDivElement>();
  // when drag starts disables text selection in pdf
  const onDragStart = () => toggleTextSelection(true);
  const onDragEnd = () => toggleTextSelection(false);
  const shouldStart = (event: MouseEvent) =>
    enableAreaSelection(event) &&
    isHTMLElement(event.target) &&
    Boolean(asElement(event.target).closest(".page"));

  const reset = React.useCallback(() => {
    onDragEnd();
    setStart(null);
    setEnd(null);
  }, []);

  React.useEffect(() => {
    if (mounted.current) {
      // ComponentDidUpdate
      const isVisible = Boolean(start && end);
      pdfStore.setState({ isHighlightAreaInProgress: isVisible });
    }
  });

  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      // ComponentDidMount
      if (!root || !root.current) {
        return;
      }

      const container = asElement(root.current.parentElement);

      if (!isHTMLElement(container)) {
        return;
      }
      let localStart: XY | null = null;
      let locked = false;

      container.addEventListener("mousemove", (event) => {
        // sets end when mouse moves as long as
        // it is not locked and there is a start point
        if (!localStart || locked) {
          return;
        }
        const localEnd = containerCoords(event.pageX, event.pageY, container);
        setEnd(localEnd);
      });

      container.addEventListener("mousedown", (event) => {
        // freee movement on image else rerturn
        if (!shouldStart(event)) {
          const h = pdfStore.getState().newHighlightPositionAndContent;
          if (h) return;
          reset();
          locked = false;
          return;
        }
        const startTarget = asElement(event.target);
        if (!startTarget) return;
        localStart = containerCoords(event.pageX, event.pageY, container);
        onDragStart();

        setStart(localStart);
        setEnd(null);

        const onMouseUp = (e: MouseEvent) => {
          // emulate listen once
          if (!e.currentTarget) throw Error("no current target");
          e.currentTarget.removeEventListener(
            "mouseup",
            onMouseUp as EventListenerOrEventListenerObject
          );
          if (!localStart) {
            return;
          }

          const localEnd = containerCoords(e.pageX, e.pageY, container);
          setEnd(localEnd);

          const boundingRect = getBoundingRect(localStart, localEnd);

          if (
            !isHTMLElement(e.target) ||
            !container.contains(asElement(e.target)) ||
            !shouldRender(boundingRect)
          ) {
            reset();
            locked = false;
            return;
          }

          locked = true;

          if (!localStart || !localEnd) {
            return;
          }

          if (isHTMLElement(e.target)) {
            onSelection(startTarget, boundingRect);

            onDragEnd();
          }
        };

        const { ownerDocument: doc } = container;
        if (doc.body) {
          doc.body.addEventListener("mouseup", onMouseUp);
        }
      });
    }
  }, [reset, root]);

  const highlights = pdfStore((s) => s.highlights);
  React.useEffect(() => {
    setStart(null);
    setEnd(null);
    const windowSelection = window.getSelection();
    const doc = document as unknown as { selection: Selection | null };
    if (windowSelection) {
      if (windowSelection.empty) {
        // Chrome
        windowSelection.empty();
      } else if (windowSelection.removeAllRanges) {
        // Firefox
        windowSelection.removeAllRanges();
      }
    } else if (doc.selection) {
      // IE?
      doc.selection.empty();
    }
  }, [highlights]);

  return (
    <div ref={root}>
      {start && end ? (
        // Passing boundingReact through props does not work
        <SelectionDiv style={getBoundingRect(start, end)} />
      ) : null}
    </div>
  );
};
