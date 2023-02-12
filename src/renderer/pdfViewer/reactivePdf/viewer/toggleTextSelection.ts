import { viewerObject } from "./viewerObject";

export const toggleTextSelection = (flag: boolean | undefined) => {
  // when drag starts disables text selection in pdf
  // remove, used previously at mouseslecetion
  if (!viewerObject.viewer) throw Error("no viewer");

  viewerObject.viewer.viewer?.classList.toggle(
    "PdfHighlighter--disable-selection",
    flag
  );
};
