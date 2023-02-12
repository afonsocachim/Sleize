import { Editor, Element as SlateElement } from "slate";
import { SlateEditor } from "main/database/schemas/nodeSchema";

export const isBlockList = (editor: SlateEditor) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.list === true,
  });

  return !!match;
};
