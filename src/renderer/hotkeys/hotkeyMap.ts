import { OptionsHotkey } from "./isHotkey";

type HotkeysMap = {
  [key: string]: OptionsHotkey;
};

export const appHkMap: HotkeysMap = {
  toggleHotkeyHelper: { ctrl: true, key: "H" },
  studyAll: { ctrl: true, key: "S" },
  toggleNoteSearch: { ctrl: true, shift: true, key: "F" },
  toggleSourceTree: { ctrl: true, shift: true, key: "S" },
  toggleDrawerHotkey: { ctrl: true, shift: true, key: "L" },
};

export const sourceHotkeys: HotkeysMap = {
  ppVideo: { ctrl: true, key: "P" }, // pause/play video
  searchPdf: { ctrl: true, key: "P" },
};

export const slateHotkeys: HotkeysMap = {
  searchSlate: { ctrl: true, key: "F" },
};
