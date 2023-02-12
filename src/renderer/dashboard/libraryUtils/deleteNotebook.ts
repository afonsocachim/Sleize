import {
  LibraryState,
  NotebookHash,
  NotebookObj,
} from "main/database/schemas/librarySchema";
import { homeReset } from "renderer/store/resetStore";
import { libraryStore } from "../libraryStore";
import { deleteSectionNotes } from "./deleteSectionNotes";

export const deleteNotebook = (position: number, notebookObj: NotebookObj) => {
  const library = libraryStore.getState();
  const newNotebookOrder = [...library.notebookOrder];
  newNotebookOrder.splice(position, 1);
  const newNotebooks: NotebookHash = {
    ...library.notebooks,
  };
  delete newNotebooks[notebookObj.id];
  const newSections = { ...library.sections };
  const notebookSections = notebookObj.sectionIds.map((sectionId) => {
    const section = newSections[sectionId];
    delete newSections[sectionId];
    return section;
  });
  notebookSections.forEach(async (section) => {
    await deleteSectionNotes(section);
  });
  const newState: LibraryState = {
    sections: newSections,
    notebookOrder: newNotebookOrder,
    notebooks: newNotebooks,
  };

  libraryStore.setState(newState);
  homeReset();
};
