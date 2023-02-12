import { prepareFlashcards } from "renderer/store/reviewUtils/prepareFlashcards";
import { userStore } from "../userStore";

export const studyUser = async () => {
  const { noteDocumentList } = userStore.getState();
  prepareFlashcards(noteDocumentList);
};
