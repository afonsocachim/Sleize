import dayjs from "dayjs";
import {
  SuperMemoItem,
  SuperMemoGrade,
  Flashcard,
} from "main/database/schemas/flashcardSchema";
import { approvedInvokeWrapper } from "renderer/ipc/invokeWrapper";

const gradeFlashcard = (
  item: SuperMemoItem,
  grade: SuperMemoGrade
): SuperMemoItem => {
  let nextInterval: number;
  let nextRepetition: number;
  const previousReps = item.repetition;
  const matureCard = previousReps >= 3;
  const firstReview = previousReps === 0;
  const secondReview = previousReps === 1;
  const thirdReview = previousReps === 2;
  const fourthReview = previousReps === 4;
  const rightAnswer = grade === 1;
  const wrongAnswer = grade === 0;

  if (rightAnswer) {
    nextRepetition = previousReps + 1;
    if (matureCard) {
      nextInterval = Math.round(item.interval * item.efactor);
    } else if (firstReview) {
      nextInterval = 10;
    } else if (secondReview) {
      nextInterval = 45;
    } else if (thirdReview) {
      nextInterval = 1440;
    } else if (fourthReview) {
      nextInterval = 8640;
    } else {
      throw Error(`Invalid previous reps: ${previousReps}`);
    }
  } else if (wrongAnswer) {
    if (matureCard) {
      nextInterval = Math.round(item.interval / 2);
      nextRepetition = 4;
    } else {
      nextInterval = 1;
      nextRepetition = 0;
    }
  } else {
    throw Error("Grade not 0 or 1");
  }

  return {
    interval: nextInterval,
    repetition: nextRepetition,
    efactor: 2.5,
  };
};

export const practiceFlashcard = (
  flashcard: SuperMemoItem,
  grade: SuperMemoGrade
): [item: SuperMemoItem, dueDate: string] => {
  const { interval, repetition, efactor } = gradeFlashcard(flashcard, grade);
  const dueDate = dayjs(Date.now()).add(interval, "minute").toISOString();

  return [{ interval, repetition, efactor }, dueDate];
};

export const answerFlashcard = async (
  card: Flashcard,
  grade: SuperMemoGrade
) => {
  const { interval, repetition, efactor } = card;
  const item: SuperMemoItem = { interval, repetition, efactor };
  const [newItem, dueDate] = practiceFlashcard(item, grade);
  const newCard = { ...card, ...newItem, dueDate };
  await approvedInvokeWrapper("updateFlashcardHandler", newCard);
};
