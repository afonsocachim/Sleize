import { Note } from "main/database/schemas/noteSchema";
import { removeNotesInvoker } from "renderer/ipc/notesInvoker";
import { noteStore } from "../noteStore";
import { getNoteDescendants } from "./getNoteDescendants";

export const deleteNoteAndDescendants = async (note: Note) => {
  noteStore.setState({ note: undefined });
  const descendants = await getNoteDescendants(note);
  await removeNotesInvoker([...descendants.map((n) => n.id), note.id]);
};
