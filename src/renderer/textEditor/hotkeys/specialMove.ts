import React from "react";
import isHotkey from "is-hotkey";
import { SlateEditor } from "main/database/schemas/nodeSchema";
import { clipboardStore } from "./clipboardStore";
import { moveCut } from "./moveCut";
import { movePaste } from "./movePaste";

export const specialMove = async (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  if (!isHotkey("mod+shift+x", event)) return;
  event.preventDefault();
  event.stopPropagation();
  const { clipboardData } = clipboardStore.getState();
  const isCut = clipboardData.length === 0;
  if (isCut) {
    moveCut(editor);
  } else {
    movePaste(editor);
  }
};
