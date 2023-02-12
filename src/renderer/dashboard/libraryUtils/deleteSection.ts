import {
  LibraryState,
  NotebookHash,
  NotebookObj,
  SectionHash,
  SectionObj,
} from "main/database/schemas/librarySchema";
import { homeReset } from "renderer/store/resetStore";
import { libraryStore } from "../libraryStore";
import { deleteSectionNotes } from "./deleteSectionNotes";

export const deleteSection = async (
  position: number,
  sectionObj: SectionObj,
  notebookObj: NotebookObj
) => {
  const library = libraryStore.getState();
  const newSectionIds = [...notebookObj.sectionIds];
  newSectionIds.splice(position, 1);
  const newNotebook: NotebookObj = {
    ...notebookObj,
    sectionIds: newSectionIds,
  };
  const newNotebookHash: NotebookHash = {
    ...library.notebooks,
    [notebookObj.id]: newNotebook,
  };

  const newSectionHash: SectionHash = {
    ...library.sections,
  };
  delete newSectionHash[sectionObj.id];
  const newState: LibraryState = {
    ...library,
    notebooks: newNotebookHash,
    sections: newSectionHash,
  };

  deleteSectionNotes(sectionObj);
  libraryStore.setState(newState);
  homeReset();
};
