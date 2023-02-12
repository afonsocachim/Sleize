import React from "react";
import isHotkey from "is-hotkey";
import { headingArray, SlateEditor } from "main/database/schemas/nodeSchema";
import { toggleBlockWithSelection } from "../utils/toggleBlockWithSelection";

export const toggleHeadingHotkey = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  headingArray.forEach((heading) => {
    const headingNumber = parseInt(heading.slice(heading.length - 1), 10);
    if (isHotkey(`alt+shift+${7 - headingNumber}`, event)) {
      event.preventDefault();
      toggleBlockWithSelection(editor, heading);
    }
  });
};
