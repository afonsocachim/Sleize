import { cloneDeep } from "lodash";
import { SlateElement, SlateImage } from "main/database/schemas/nodeSchema";
import { slateStore } from "renderer/store/slateStore";
import { externalSetSlateValue } from "renderer/store/slateUtils/externalSetSlateValue";
import { editorContainer } from "renderer/store/slateUtils/editorContainer";
import { Selection } from "slate";

export const expandCollapseImage = (element: SlateElement) => {
  const { value } = slateStore.getState();
  if (!value) throw Error("No value");
  const cloneValue = cloneDeep(value);
  const nodeIndex = cloneValue.findIndex((n) => n.id === element.id);
  if (nodeIndex === -1) throw Error("No node");
  const node = cloneValue[nodeIndex] as SlateImage;
  const newNode: SlateImage = {
    ...node,
    image: { ...node.image, isCollapsed: !node.image.isCollapsed },
  };
  cloneValue[nodeIndex] = newNode;
  externalSetSlateValue(cloneValue);
  const newSelection: Selection = {
    anchor: { offset: 0, path: [nodeIndex, 0] },
    focus: { offset: 0, path: [nodeIndex, 0] },
  };
  editorContainer.editor.selection = newSelection;
};
