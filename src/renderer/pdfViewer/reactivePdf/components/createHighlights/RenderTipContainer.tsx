import { ViewportPosition } from "../../../../../main/database/schemas/highlightSchema";
import { ViewerObject } from "../../viewer/viewerObject";
import TipContainer from "./TipContainer";

export const RenderTipContainer = ({
  tipPosition,
  viewerObject,
}: {
  tipPosition: ViewportPosition | null;
  viewerObject: ViewerObject;
}) => {
  if (!tipPosition) return null;
  if (!viewerObject.viewer) return null;
  const { boundingRect, pageNumber } = tipPosition;
  if (!viewerObject.viewer.getPageView(pageNumber - 1)) return null;

  const page = {
    node: viewerObject.viewer.getPageView(pageNumber - 1).div,
  };
  const style = {
    left: page.node.offsetLeft + boundingRect.left + boundingRect.width / 2,
    top: boundingRect.top + page.node.offsetTop,
    bottom: boundingRect.top + page.node.offsetTop + boundingRect.height,
  };

  return (
    <TipContainer
      scrollTop={viewerObject.viewer.container.scrollTop}
      pageBoundingRect={page.node.getBoundingClientRect()}
      style={style}
    />
  );
};
