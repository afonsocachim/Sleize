import { drawerStore } from "renderer/store/drawerStore";
import { isHotkey } from "renderer/hotkeys/isHotkey";
import { appHkMap } from "renderer/hotkeys/hotkeyMap";

export const toggleDrawerHotkey = (e: KeyboardEvent) => {
  if (!isHotkey(e, appHkMap.toggleDrawerHotkey)) return;
  const { isDrawerOpen } = drawerStore.getState();
  drawerStore.setState({ isDrawerOpen: !isDrawerOpen });
};
