import React from "react";
import isHotkey from "is-hotkey";
import { SlateEditor } from "main/database/schemas/nodeSchema";
import { toggleBlockWithSelection } from "../utils/toggleBlockWithSelection";

export const toggleQuestionBlock = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  if (!isHotkey("alt+shift+a", event)) return;
  event.preventDefault();
  toggleBlockWithSelection(editor, "Question");
};
