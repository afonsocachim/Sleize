import {
  LibraryState,
  NotebookHash,
  NotebookObj,
} from "main/database/schemas/librarySchema";
import { libraryStore } from "../libraryStore";

export const editNotebookTitle = (title: string, notebookObj: NotebookObj) => {
  const library = libraryStore.getState();
  const newNotebook = { ...notebookObj, title };
  const newNotebooks: NotebookHash = {
    ...library.notebooks,
    [notebookObj.id]: newNotebook,
  };
  const newState: LibraryState = {
    ...library,
    notebooks: newNotebooks,
  };
  libraryStore.setState(newState);
};
