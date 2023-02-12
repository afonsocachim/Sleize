import { approvedInvokeWrapper } from "renderer/ipc/invokeWrapper";
import { reviewStore } from "../reviewStore";

export const listCurrentFlashcards = async () => {
  const { reviewNotes } = reviewStore.getState();
  const noteIds = Object.keys(reviewNotes);

  const result = await approvedInvokeWrapper(
    "listCurrentFlashcardsHandler",
    noteIds
  );
  if (result.error) return;
  const { data: flashcards } = result;
  const set = reviewStore.setState;

  const noCards = flashcards.length === 0;

  if (noCards) {
    set({ currentCard: undefined });
  } else {
    set({ currentCard: flashcards[0] });
  }

  set({
    remainingCardsNumber: flashcards.length,
    showAnswer: false,
    loadingCard: false,
  });
};
