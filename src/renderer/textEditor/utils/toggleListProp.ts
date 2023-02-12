import { Transforms } from "slate";
import { SlateEditor } from "main/database/schemas/nodeSchema";
import { isBlockActive } from "./isBlockActive";
import { isBlockList } from "./isBlockList";

export const toggleListProp = async (editor: SlateEditor) => {
  const isBlock =
    isBlockActive(editor, "Paragraph") || isBlockActive(editor, "Question");
  if (!isBlock) return;
  const isList = isBlockList(editor);
  Transforms.setNodes(editor, {
    list: !isList,
  });
};
