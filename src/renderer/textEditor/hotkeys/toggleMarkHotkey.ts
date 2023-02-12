import isHotkey from "is-hotkey";
import { Marks, SlateEditor } from "main/database/schemas/nodeSchema";
import { toggleMark } from "../utils/helperFunctions";

type Hotkeys = {
  [x: string]: Marks;
};

const hotkeys: Hotkeys = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
};

export const toggleMarkHotkey = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  Object.entries(hotkeys).forEach(([key, value]) => {
    if (isHotkey(key, event)) {
      event.preventDefault();
      toggleMark(editor, value);
    }
  });
};
