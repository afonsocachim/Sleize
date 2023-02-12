import { SectionObj } from "main/database/schemas/librarySchema";
import createStore from "zustand";

type SectionStore = {
  section: SectionObj | undefined;
};
const iStore: SectionStore = { section: undefined };

export const sectionStore = createStore<SectionStore>(() => iStore);

export const resetSectionStore = () => sectionStore.setState(iStore);
