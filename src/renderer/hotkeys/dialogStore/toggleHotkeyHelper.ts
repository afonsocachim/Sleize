import { isHotkey } from "renderer/hotkeys/isHotkey";
import { toggleDialog } from "./toggleDialog";
import { appHkMap } from "../hotkeyMap";

export const toggleHotkeyHelper = (e: KeyboardEvent) => {
  if (!isHotkey(e, appHkMap.toggleHotkeyHelper)) return;
  toggleDialog("HOTKEY_HELPER");
};
