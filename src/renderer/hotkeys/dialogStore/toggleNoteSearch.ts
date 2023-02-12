import { isHotkey } from "renderer/hotkeys/isHotkey";
import { toggleDialog } from "./toggleDialog";
import { appHkMap } from "../hotkeyMap";

export const toggleNoteSearch = (e: KeyboardEvent) => {
  if (!isHotkey(e, appHkMap.toggleNoteSearch)) return;
  toggleDialog("NOTE_SEARCH");
};
