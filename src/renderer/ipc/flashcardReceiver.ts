import { debounce } from "lodash";
import { dateStore } from "renderer/store/dateStore";
import { ipcRenderer } from "./ipcRenderer";

const SET_FLASHCARD_CHANGE = (newId: string) => {
  dateStore.setState({ flashcardChange: newId });
};

const setFlashcardChange = debounce(SET_FLASHCARD_CHANGE, 100);

export const flashcardReceiver = () => {
  ipcRenderer.on("flashcard/change", (event, flashcardChange: string) => {
    setFlashcardChange(flashcardChange);
  });
};
