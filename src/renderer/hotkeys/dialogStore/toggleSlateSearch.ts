import { isHotkey } from "renderer/hotkeys/isHotkey";
import { toggleDialog } from "./toggleDialog";

export const toggleSlateSearch = (e: KeyboardEvent) => {
  if (!isHotkey(e, { ctrl: true, key: "F" })) return;
  toggleDialog("SLATE_SEARCH");
};
