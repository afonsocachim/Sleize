import { viewerObject } from "./viewerObject";

export const toolbarScaleValue = (n: number) => {
  if (!viewerObject.viewer) return;
  const flatScale = n / 100;
  const scale = flatScale.toString();
  const v: any = viewerObject.viewer;
  const pageWidthScale =
    ((v.container.clientWidth / v._pages[0].width) * v._pages[0].scale) / 1;
  v.currentScale = pageWidthScale * parseFloat(scale);
};
