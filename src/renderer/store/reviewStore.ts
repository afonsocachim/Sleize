import { Flashcard } from "main/database/schemas/flashcardSchema";
import { Note } from "main/database/schemas/noteSchema";
import createStore from "zustand";

type ReviewStore = {
  reviewMode: boolean;
  reviewNotes: { [noteId: string]: Note };
  currentCard: undefined | Flashcard;
  remainingCardsNumber: number;
  showAnswer: boolean;
  loadingCard: boolean;
};

export const initialReviewStore: ReviewStore = {
  reviewMode: false,
  reviewNotes: {},
  currentCard: undefined,
  remainingCardsNumber: 0,
  showAnswer: false,
  loadingCard: false,
};

export const reviewStore = createStore<ReviewStore>(() => initialReviewStore);

export const resetReviewStore = () => reviewStore.setState(initialReviewStore);
