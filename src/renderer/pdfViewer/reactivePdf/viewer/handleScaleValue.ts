import { debounce } from "lodash";
import { viewerObject } from "./viewerObject";

export const handleScaleValue = () => {
  if (!viewerObject.viewer) return;
  viewerObject.viewer.currentScaleValue = "auto";
};
export const debouncedScaleValue = debounce(handleScaleValue, 500);
