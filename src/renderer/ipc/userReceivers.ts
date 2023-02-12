import { Flashcard } from "main/database/schemas/flashcardSchema";
import { Note } from "main/database/schemas/noteSchema";
import { Source } from "main/database/schemas/sourceSchema";
import { userStore } from "renderer/store/userStore";
import { ipcRenderer } from "./ipcRenderer";

export const userReceivers = () => {
  ipcRenderer.on("users/list/sources", (event, userSources: Source[]) => {
    userStore.setState({ userSourceList: userSources });
  });

  ipcRenderer.on("users/list/notes", (event, userNotes: Note[]) => {
    userStore.setState({ noteDocumentList: userNotes });
  });

  ipcRenderer.on(
    "users/list/flashcards",
    (event, userFlashcards: Flashcard[]) => {
      userStore.setState({ userFlashcardList: userFlashcards });
    }
  );
};
