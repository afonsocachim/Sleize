import { studyUser } from "renderer/store/reviewUtils/studyUser";
import { userStore } from "renderer/store/userStore";
import { isHotkey } from "renderer/hotkeys/isHotkey";
import { appHkMap } from "renderer/hotkeys/hotkeyMap";
import { reviewStore } from "renderer/store/reviewStore";
import { exitReviewScreen } from "renderer/store/reviewUtils/exitReviewScreen";

export const studyAllHotkey = (e: KeyboardEvent) => {
  if (!isHotkey(e, appHkMap.studyAll)) return;
  const { user: u } = userStore.getState();
  if (!u) throw Error("no user");
  if (!reviewStore.getState().reviewMode) {
    studyUser();
    return;
  }
  exitReviewScreen();
};
