import { SectionObj } from "main/database/schemas/librarySchema";
import { Note } from "main/database/schemas/noteSchema";
import { getSectionNotesInvoker } from "renderer/ipc/notesInvoker";
import { deleteNoteAndDescendants } from "renderer/store/noteUtils/deleteNoteAndDescendants";

export const deleteSectionNotes = async (sectionObj: SectionObj) => {
  const result = await getSectionNotesInvoker([sectionObj.id]);
  if (result.error) return;
  const notes: Note[] = result.data;
  await Promise.all(
    notes.map(async (note) => {
      await deleteNoteAndDescendants(note);
    })
  );
};
