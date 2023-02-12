import { NotebookObj } from "main/database/schemas/librarySchema";
import { prepareFlashcards } from "renderer/store/reviewUtils/prepareFlashcards";
import { getSectionNotesInvoker } from "renderer/ipc/notesInvoker";

export const studyNotebook = async (notebook: NotebookObj) => {
  const { sectionIds } = notebook;
  const result = await getSectionNotesInvoker(sectionIds);
  if (result.error) return;
  prepareFlashcards(result.data);
};
