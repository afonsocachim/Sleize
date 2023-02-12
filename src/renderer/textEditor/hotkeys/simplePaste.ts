import React from "react";
import isHotkey from "is-hotkey";
import { SlateEditor } from "main/database/schemas/nodeSchema";

export const simplePaste = async (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  if (!isHotkey("mod+shift+v", event)) return;
  event.preventDefault();
  event.stopPropagation();
  const text = await navigator.clipboard.readText();
  editor.insertText(text);
};
