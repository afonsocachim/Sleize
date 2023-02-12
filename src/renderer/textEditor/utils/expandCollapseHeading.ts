import { Transforms, Path } from "slate";
import {
  headingArray,
  SlateEditor,
  SlateElement,
} from "main/database/schemas/nodeSchema";
import { getLastLeafAndOffsetOfNode } from "./getLastLeafAndOffsetOfNode";

export const expandCollapseHeading = (
  path: Path,
  element: SlateElement,
  editor: SlateEditor
): undefined => {
  // when dealing with slate value cloneDeep avoids all kinds of errors
  const isCollapsed = element.nestedNodes.length > 0;
  if (isCollapsed) {
    const nodes = [...element.nestedNodes] as SlateElement[];
    Transforms.setNodes(editor, { nestedNodes: [] }, { at: path });
    Transforms.insertNodes(editor, nodes, { at: [path[0] + 1] });

    return;
  }
  const value = [...editor.children] as SlateElement[];
  const valueLastIndex = value.length - 1;
  const elIndex = value.findIndex((node) => node.id === element.id);
  const elementsAfterHeading = value.slice(elIndex + 1);
  // if there are no elements to collapse doesn't collapse any
  if (elementsAfterHeading.length <= 0) return undefined;
  const elementHeadingNumber = Number(element.blockType.slice(-1));
  // numberToCollapse is the number of elements after a heading to collapse
  const collapseIndex = elementsAfterHeading.findIndex((node) => {
    if (!headingArray.find((h) => h === node.blockType)) return false;
    const nodeHeadingNumber = Number(node.blockType.slice(-1));
    const isEqualOrGreaterHeading = elementHeadingNumber >= nodeHeadingNumber;
    if (isEqualOrGreaterHeading) return true;
    return false;
  });
  let endCollapseIndex: number | undefined;

  if (collapseIndex > 0) {
    endCollapseIndex = elIndex + collapseIndex;
  } else if (collapseIndex === 0) {
    // if the next equal heading is directly next there is nothing to collapse
    return undefined;
  } else {
    // If numberToCollapse is -1 collapse till the end
    endCollapseIndex = valueLastIndex;
  }

  const afterElementIndex = elIndex + 1;
  const [lastLeafIndex, lastLeafOffset] = getLastLeafAndOffsetOfNode(
    value[endCollapseIndex]
  );

  const anchor = {
    path: [afterElementIndex, 0],
    offset: 0,
  };
  const focus = {
    path: [endCollapseIndex, lastLeafIndex],
    offset: lastLeafOffset,
  };

  const elementsToCollapse = value.slice(
    afterElementIndex,
    endCollapseIndex + 1
  );

  const location = { anchor, focus };

  if (location && editor) {
    Transforms.setNodes(
      editor,
      { nestedNodes: elementsToCollapse },
      { at: path }
    );

    for (let i = endCollapseIndex; i >= afterElementIndex; i -= 1) {
      Transforms.removeNodes(editor, { at: [i] });
    }
  }
  return undefined;
};
