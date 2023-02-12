import { debounce } from "lodash";
import { LTWH, HighlightViewport } from "main/database/schemas/highlightSchema";
import { pdfStore } from "renderer/pdfViewer/pdfStore";
import { renderStore } from "renderer/pdfViewer/reactivePdf/renderStore";
import { TextHighlight } from "./TextHighlight";
import { AreaHighlight } from "./AreaHighlight";

type HighlighTransformProps = {
  highlight: HighlightViewport;
  index: number;
  takeScreenshot: (position: LTWH) => string;
  isScrolledTo: boolean;
};

const showTooltip = (highlight: HighlightViewport) => {
  const { highlightBeingCreated } = renderStore.getState();
  if (highlightBeingCreated) return;
  pdfStore.setState({
    tipPosition: highlight.position,
  });
  renderStore.setState({ highlight });
};
const HIDE_TOOLTIP = () => {
  const { highlightBeingCreated, allowChange } = renderStore.getState();
  if (highlightBeingCreated) return;
  if (allowChange) {
    pdfStore.setState({
      tipPosition: null,
    });
    renderStore.setState({ highlight: undefined });
  }
};

const hideTooltip = debounce(HIDE_TOOLTIP, 50);

export const HighlightTransform = ({
  highlight,
  index,
  takeScreenshot,
  isScrolledTo,
}: HighlighTransformProps) => {
  const { content } = highlight;
  const isTextHighlight = Boolean(content.text);

  return (
    <div
      key={index}
      onMouseLeave={hideTooltip}
      onMouseOver={() => showTooltip(highlight)}
      onFocus={() => showTooltip(highlight)}
    >
      {isTextHighlight ? (
        <TextHighlight isScrolledTo={isScrolledTo} highlight={highlight} />
      ) : (
        <AreaHighlight
          isScrolledTo={isScrolledTo}
          highlight={highlight}
          screenshot={takeScreenshot}
        />
      )}
    </div>
  );
};
