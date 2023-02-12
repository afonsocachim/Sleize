import { SlateEditor } from "main/database/schemas/nodeSchema";
import { isBlockActive } from "../utils/isBlockActive";
import { toggleCloze } from "./toggleCloze";

export const toggleClozeEqual = async (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  if (event.altKey) return;
  if (!event.ctrlKey || !event.shiftKey || event.code !== "KeyD") return;
  if (!isBlockActive(editor, "Question")) return;
  event.preventDefault();
  event.stopPropagation();
  toggleCloze(editor, false);
};
