import { v4 } from "uuid";
import {
  LibraryState,
  NotebookHash,
  NotebookObj,
  SectionHash,
  SectionObj,
} from "main/database/schemas/librarySchema";
import { libraryStore } from "../libraryStore";

export const createSection = (title: string, notebookObj: NotebookObj) => {
  const newSection: SectionObj = {
    id: v4(),
    title,
  };
  const library = libraryStore.getState();
  const newNotebook: NotebookObj = {
    ...notebookObj,
    sectionIds: [...notebookObj.sectionIds, newSection.id],
  };
  const newNotebookHash: NotebookHash = {
    ...library.notebooks,
    [notebookObj.id]: newNotebook,
  };

  const newSectionHash: SectionHash = {
    ...library.sections,
    [newSection.id]: newSection,
  };
  const newState: LibraryState = {
    ...library,
    notebooks: newNotebookHash,
    sections: newSectionHash,
  };
  libraryStore.setState(newState);
};
