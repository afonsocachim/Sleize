import { SlateElement } from "main/database/schemas/nodeSchema";

export const getLastLeafAndOffsetOfNode = (element: SlateElement) => {
  const lastLeafIndex = element.children.length - 1;
  const lastLeafOffset = element.children[lastLeafIndex].text.length;

  return [lastLeafIndex, lastLeafOffset];
};
