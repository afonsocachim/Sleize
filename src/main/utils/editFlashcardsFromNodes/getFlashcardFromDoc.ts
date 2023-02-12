import {
  Flashcard,
  FlashcardDocument,
} from "../../database/schemas/flashcardSchema";

export const getFlashcardFromDoc = (c: FlashcardDocument): Flashcard => {
  const {
    id,
    owner,
    clozeNumber,
    nodeId,
    noteId,
    interval,
    repetition,
    efactor,
    dueDate,
  } = c;
  return {
    id,
    owner,
    clozeNumber,
    nodeId,
    noteId,
    interval,
    repetition,
    efactor,
    dueDate,
  };
};
