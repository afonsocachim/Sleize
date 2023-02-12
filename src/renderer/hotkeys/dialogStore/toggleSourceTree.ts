import { isHotkey } from "renderer/hotkeys/isHotkey";
import { toggleDialog } from "./toggleDialog";
import { appHkMap } from "../hotkeyMap";

export const toggleSourceTree = (e: KeyboardEvent) => {
  if (!isHotkey(e, appHkMap.toggleSourceTree)) return;
  toggleDialog("SOURCE_TREE");
};
