import { Flashcard } from "main/database/schemas/flashcardSchema";
import { approvedInvokeWrapper } from "renderer/ipc/invokeWrapper";

export const listNoteFlashcards = async (
  noteIds: string[],
  setCards: (c: Flashcard[]) => void
) => {
  const result = await approvedInvokeWrapper(
    "listTodayFlashcardsHandler",
    noteIds
  );
  if (result.error) return;
  setCards(result.data);
};
