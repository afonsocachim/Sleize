import { mainStore } from "main/store/mainStore";
import { getLastMinuteOfToday } from "main/utils/getLastMinuteOfToday";
import { getCurrentDate } from "main/utils/getCurrentDate";
import { sourceController } from "./sourceController/sourceController";
import { userController } from "./userController/userController";
import { notesController } from "./notesController/notesController";
import { flashcardController } from "./flashcardController/flashcardController";

setInterval(() => {
  const { lastMinuteOfToday } = mainStore.getState();
  const newLastMinute = getLastMinuteOfToday();
  if (lastMinuteOfToday !== newLastMinute) {
    mainStore.setState({ lastMinuteOfToday: newLastMinute });
  }
  mainStore.setState({ currentDate: getCurrentDate() });
}, 1000);

export const controllers = () => {
  userController();
  sourceController();
  notesController();
  flashcardController();
};
