import {
  LibraryState,
  SectionHash,
  SectionObj,
} from "main/database/schemas/librarySchema";
import { sectionStore } from "renderer/store/sectionStore";
import { libraryStore } from "../libraryStore";

export const editSectionTitle = (title: string, sectionObj: SectionObj) => {
  const library = libraryStore.getState();
  const newSection: SectionObj = {
    ...sectionObj,
    title,
  };

  const newSectionHash: SectionHash = {
    ...library.sections,
    [newSection.id]: newSection,
  };
  const newState: LibraryState = {
    ...library,
    sections: newSectionHash,
  };
  libraryStore.setState(newState);
  sectionStore.setState({ section: newSection });
};
