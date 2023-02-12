import isHotkey from "is-hotkey";
import React from "react";
import { Editor } from "slate";
import { SlateEditor } from "main/database/schemas/nodeSchema";

const { insertText } = Editor;

export const shiftEnterPress = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  if (!isHotkey("shift+enter", event)) return;
  event.preventDefault();
  insertText(editor, "\n");
};
