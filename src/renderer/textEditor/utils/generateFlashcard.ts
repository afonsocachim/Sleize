import dayjs from "dayjs";
import { noteStore } from "renderer/store/noteStore";
import { userStore } from "renderer/store/userStore";
import { Flashcard } from "main/database/schemas/flashcardSchema";

export const generateFlashcard = (
  nodeId: string,
  clozeNumber: number
): Flashcard => {
  const { user } = userStore.getState();
  if (!user) throw Error("No user at generateDefaultFlashcard");
  const { note } = noteStore.getState();
  if (!note) throw Error("No note at generateDefaultFlashcard");
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
