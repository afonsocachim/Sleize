import { prepareFlashcards } from "renderer/store/reviewUtils/prepareFlashcards";
import { SectionObj } from "main/database/schemas/librarySchema";
import { getSectionNotesInvoker } from "renderer/ipc/notesInvoker";

export const studySection = async (section: SectionObj) => {
  const result = await getSectionNotesInvoker([section.id]);
  if (result.error) return;
  prepareFlashcards(result.data);
};
