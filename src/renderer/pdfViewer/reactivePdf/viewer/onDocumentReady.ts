import { handleScaleValue } from "./handleScaleValue";
import { ViewerObject } from "./viewerObject";

export const onDocumentReady = (viewerObject: ViewerObject) => {
  handleScaleValue();
};
