import { Editor, Element as SlateElement } from "slate";
import { SlateEditor, BlockTypes } from "main/database/schemas/nodeSchema";

export const isBlockActive = (editor: SlateEditor, format: BlockTypes) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      n.blockType === format,
  });

  return !!match;
};
