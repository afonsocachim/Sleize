import dayjs from "dayjs";
import { mainStore } from "main/store/mainStore";
import { Flashcard } from "../../database/schemas/flashcardSchema";
import { NoteDocument } from "../../database/schemas/noteSchema";

export const generateFlashcard = (
  nodeId: string,
  clozeNumber: number,
  note: NoteDocument
): Flashcard => {
  const { user } = mainStore.getState();
  if (!user) throw Error("No user at generateDefaultFlashcard");
  const newFlashcard: Flashcard = {
    owner: user.username,
    noteId: note.id,
    nodeId,
    clozeNumber,
    id: `${nodeId}|${clozeNumber}`,
    interval: 0,
    repetition: 0,
    efactor: 2.5,
    dueDate: dayjs(Date.now()).toISOString(),
  };
  return newFlashcard;
};
