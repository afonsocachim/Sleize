import createStore from "zustand";
import { User } from "main/database/schemas/userSchema";
import { Source } from "main/database/schemas/sourceSchema";
import { Note } from "main/database/schemas/noteSchema";
import { Flashcard } from "main/database/schemas/flashcardSchema";

type UserStore = {
  user: null | User;
  userSourceList: Source[];
  noteDocumentList: Note[];
  userFlashcardList: Flashcard[];
};

const iStore: UserStore = {
  user: null,
  userSourceList: [],
  noteDocumentList: [],
  userFlashcardList: [],
};

export const userStore = createStore<UserStore>(() => iStore);

export const resetUserStore = () => userStore.setState(iStore);
