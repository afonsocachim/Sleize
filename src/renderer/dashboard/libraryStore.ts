import createStore from "zustand";
import { LibraryState } from "main/database/schemas/librarySchema";

const iStore: LibraryState = {
  sections: {},
  notebooks: {},
  notebookOrder: [],
};

export const libraryStore = createStore<LibraryState>(() => iStore);
export const resetLibraryStore = () => libraryStore.setState(iStore);
