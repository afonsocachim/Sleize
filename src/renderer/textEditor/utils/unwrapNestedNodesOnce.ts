import { SlateElement } from "main/database/schemas/nodeSchema";

export const unwrapNestedNodesOnce = (
  elements: SlateElement[]
): SlateElement[] => {
  const newNodes = elements.flatMap((el): SlateElement[] => {
    const elHasNested = el.nestedNodes.length > 0;
    let returnValue: SlateElement[] = [];
    const { nestedNodes } = el;
    const newEl: SlateElement = { ...el, nestedNodes: [] };
    if (!elHasNested) returnValue = [newEl];
    returnValue = [newEl, ...nestedNodes] as SlateElement[];
    return returnValue;
  });
  if (newNodes.length < elements.length)
    throw Error("new nodes smaller length");
  return newNodes;
};
