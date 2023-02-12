import { v4 as generateId } from "uuid";
import { SlateParagraph, SlateElement } from "main/database/schemas/nodeSchema";

export const getInitialNode = (): SlateParagraph => ({
  children: [{ text: "" }],
  blockType: "Paragraph",
  list: false,
  id: generateId(),
  source: null,
  image: null,
  nestedNodes: [],
});

export const getInitialNodes = (): SlateElement[] => [getInitialNode()];
