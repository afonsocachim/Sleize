import { Rnd } from "react-rnd";
import { makeStyles } from "@mui/styles";
import { HighlightViewport, LTWH } from "main/database/schemas/highlightSchema";
import { updateAndSetSourceInvoker } from "renderer/ipc/sourceInvokers";
import { sourceStore } from "renderer/store/sourceStore";
import { pdfToolbarStore } from "renderer/pdfViewer/pdfToolbarStore";
import { pdfStore } from "../../../pdfStore";
import { scaleLTWHP } from "./scaleHighlight";

const useStyles = makeStyles(() => ({
  areaHighlight: {
    border: "1px solid #333",
    backgroundColor: "rgba(252, 232, 151, 1.0)",
    opacity: 1,
    "mix-blend-mode": "multiply",
  },
  highlightPart: (props: { isScrolledTo: boolean; color: string }) => ({
    cursor: "pointer",
    position: "absolute",
    background: props.isScrolledTo ? "#ff4141" : props.color,
    transition: "background 0.3s",
  }),
}));

export const AreaHighlight = ({
  highlight: passedHighlight,
  isScrolledTo,
  screenshot: takeScreenshot,
}: {
  highlight: HighlightViewport;
  isScrolledTo: boolean;
  screenshot: (position: LTWH) => string;
}) => {
  const styleProps = { isScrolledTo, color: passedHighlight.color };
  const classes = useStyles(styleProps);
  // store

  const highlights = pdfStore((s) => s.highlights);
  const ratio = pdfToolbarStore((s) => 100 / s.CurrentPageScalePercent);

  const updateHighlight = async (b: LTWH) => {
    const boundingRect = scaleLTWHP(b, ratio);
    const content = { image: takeScreenshot(boundingRect) };
    const highlightId = passedHighlight.id;
    const highlight = highlights.find((h) => highlightId === h.id);
    if (!highlight) throw Error("newHighlight");
    const { source } = sourceStore.getState();
    if (!source) throw Error("No pdf");
    const oldHighlights = [...source.highlights];

    const newH: HighlightViewport = {
      ...passedHighlight,
      content,
      position: { ...highlight.position, boundingRect },
    };

    const newHighlights = oldHighlights.map((h) => {
      if (h.id === passedHighlight.id) return newH;
      return h;
    });
    const newSource = { ...source, highlights: newHighlights };
    await updateAndSetSourceInvoker(newSource);
  };

  return (
    <div className={classes.areaHighlight}>
      <Rnd
        className={classes.highlightPart}
        onDragStop={(_, data) => {
          const boundingRect = {
            ...passedHighlight.position.boundingRect,
            top: data.y,
            left: data.x,
          };

          updateHighlight(boundingRect);
        }}
        onResizeStop={(_1, _2, ref, _3, position) => {
          const boundingRect = {
            top: position.y,
            left: position.x,
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          };

          updateHighlight(boundingRect);
        }}
        position={{
          x: passedHighlight.position.boundingRect.left,
          y: passedHighlight.position.boundingRect.top,
        }}
        size={{
          width: passedHighlight.position.boundingRect.width,
          height: passedHighlight.position.boundingRect.height,
        }}
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
          event.preventDefault();
        }}
      />
    </div>
  );
};
