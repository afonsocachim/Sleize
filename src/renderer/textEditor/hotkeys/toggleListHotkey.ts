import { SlateEditor } from "main/database/schemas/nodeSchema";
import { isBlockActive } from "../utils/isBlockActive";
import { toggleListProp } from "../utils/toggleListProp";

export const toggleListHotkey = async (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  if (event.altKey) return;
  if (event.code !== "KeyU" || !event.ctrlKey || !event.shiftKey) return;
  const isValidBlock =
    isBlockActive(editor, "Paragraph") || isBlockActive(editor, "Question");
  if (!isValidBlock) return;
  event.preventDefault();
  event.stopPropagation();
  toggleListProp(editor);
};
