import { Note } from "main/database/schemas/noteSchema";
import { getNotesInvoker } from "renderer/ipc/notesInvoker";
import { getNoteDescendants } from "../noteUtils/getNoteDescendants";
import { reviewStore } from "../reviewStore";
import { closeDrawer } from "../drawerStore";

export const prepareFlashcards = async (oldNotes: Note[]) => {
  const reviewNotes: { [noteId: string]: Note } = {};
  const { data } = await getNotesInvoker(oldNotes.map((n) => n.id));
  const notes = data as Note[];
  notes.forEach((note) => {
    const treeDescendants = getNoteDescendants(note);
    reviewNotes[note.id] = note;
    treeDescendants.forEach((n) => {
      reviewNotes[n.id] = note;
    });
  });
  reviewStore.setState({
    reviewNotes,
  });
  reviewStore.setState({
    reviewMode: true,
  });
  closeDrawer();
};
