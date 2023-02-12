import { mainIpcHandler } from "../errorWrapper";
import { listCurrentFlashcardsHandler } from "./flashcardHandler/listCurrentFlashcardsHandler";
import { listTodayFlashcardsHandler } from "./flashcardHandler/listTodayFlashcardsHandler";
import { updateFlashcardHandler } from "./flashcardHandler/updateFlashcardHandler";
import { detectFlashcardChangeLister } from "./flashcardLister/detectFlashcardChangeLister";
import { editFlashcardsLister } from "./flashcardLister/editFlashcardsLister";

export const flashcardController = () => {
  detectFlashcardChangeLister("flashcards/change");
  editFlashcardsLister();
  mainIpcHandler("listCurrentFlashcardsHandler", listCurrentFlashcardsHandler);
  mainIpcHandler("listTodayFlashcardsHandler", listTodayFlashcardsHandler);
  mainIpcHandler("updateFlashcardHandler", updateFlashcardHandler);
};
