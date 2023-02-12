import { v4 } from "uuid";
import {
  LibraryState,
  NotebookHash,
  NotebookObj,
} from "main/database/schemas/librarySchema";
import { libraryStore } from "../libraryStore";

export const createNotebook = (title: string) => {
  const newNotebook: NotebookObj = {
    id: v4(),
    title,
    sectionIds: [],
  };
  const library = libraryStore.getState();
  const newNotebookOrder = [...library.notebookOrder, newNotebook.id];
  const newNotebooks: NotebookHash = {
    ...library.notebooks,
    [newNotebook.id]: newNotebook,
  };
  const newState: LibraryState = {
    ...library,
    notebookOrder: newNotebookOrder,
    notebooks: newNotebooks,
  };
  libraryStore.setState(newState);
};
