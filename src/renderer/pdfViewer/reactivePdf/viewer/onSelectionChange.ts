import { viewerObject } from "./viewerObject";
import { getWindow } from "../utils/pdfjsDom";
import { pdfStore } from "../../pdfStore";
import { afterSelection } from "../utils/afterSelection";

export const onSelectionChange = () => {
  const { setIsCollapsed } = pdfStore.getState();
  const container = viewerObject.containerNode;
  const selection = getWindow(container).getSelection();
  if (!selection) throw Error("No selection");
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  if (selection.isCollapsed) {
    setIsCollapsed(true);
    return;
  }

  if (
    !range ||
    !container ||
    !container.contains(range.commonAncestorContainer)
  ) {
    return;
  }
  setIsCollapsed(false);

  afterSelection(range);
};
