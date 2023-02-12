import createStore from "zustand";
import { Note } from "main/database/schemas/noteSchema";

type NoteStore = {
  note: Note | undefined;
  focusMode: boolean;
  showSources: boolean;
};
const iStore: NoteStore = {
  note: undefined,
  focusMode: false,
  showSources: false,
};

export const noteStore = createStore<NoteStore>(() => iStore);

export const resetNoteStore = () => noteStore.setState(iStore);
