import { isEmpty } from "lodash";
import {
  SlateQuestion,
  SlateImage,
  SlateElement,
} from "../../database/schemas/nodeSchema";
import {
  Flashcard,
  FlashcardDocument,
} from "../../database/schemas/flashcardSchema";
import { NoteDocument } from "../../database/schemas/noteSchema";
import { MyDatabase } from "../../database/types";
import { getClozeNumberSetFromLeaves } from "./getClozeNumberSetFromLeaves";
import { getClozeNumberSetFromSvg } from "./getClozeNumberSetFromSvg";
import { getFlashcardFromDoc } from "./getFlashcardFromDoc";
import { generateFlashcard } from "./generateFlashcard";

export const editFlashcardsFromNodes = async (
  note: NoteDocument,
  db: MyDatabase
) => {
  const { flashcardcollection } = db;
  const flashcardObj: { [x: string]: FlashcardDocument[] } = {};
  const valueObj: { [x: string]: SlateQuestion | SlateImage } = {};
  const { deletedFlashcards } = note.data;
  const newDeletedFlashcards = { ...deletedFlashcards };
  const bulkRemove: string[] = [];
  const bulkInsert: Flashcard[] = [];
  // delete cards whose block no longer exists or is not a question / image block
  const flashcards = await flashcardcollection
    .find({ selector: { noteId: note.id } })
    .exec();

  flashcards.forEach((f) => {
    const docs: FlashcardDocument[] | undefined = flashcardObj[f.nodeId];
    if (!docs) flashcardObj[f.nodeId] = [f];
    if (docs) flashcardObj[f.nodeId] = [...docs, f];
  });
  const nodes = note.data.nodes as SlateElement[];
  nodes.forEach((n) => {
    if (n.blockType === "Question" || n.blockType === "Image") {
      valueObj[n.id] = n;
    }
  });
  const entries = Object.entries(flashcardObj);
  entries.forEach(([nodeId, flashcardDocs]) => {
    if (!valueObj[nodeId]) {
      flashcardDocs.forEach((f) => {
        const newCard = getFlashcardFromDoc(f);
        if (f.deleted === false) {
          newDeletedFlashcards[newCard.id] = newCard;
          bulkRemove.push(f.id);
        }
      });
    }
  });

  // for the question/image blocks that exist check if the flashcards are ok

  Object.values(valueObj).forEach((questionNode) => {
    const localFlashcards: FlashcardDocument[] = flashcardObj[questionNode.id]
      ? flashcardObj[questionNode.id]
      : [];

    const clozeNumberSet =
      questionNode.blockType === "Question"
        ? getClozeNumberSetFromLeaves(questionNode.children)
        : getClozeNumberSetFromSvg(questionNode.image.svgObjects);

    const cardsToRemove: FlashcardDocument[] = [];
    localFlashcards.forEach((card) => {
      const clozeFound = clozeNumberSet.has(card.clozeNumber);
      if (!clozeFound) cardsToRemove.push(card);
    });

    const cardsToCreate: Flashcard[] = [];
    clozeNumberSet.forEach((n) => {
      const cardFound = localFlashcards.find((card) => card.clozeNumber === n);
      if (cardFound) return;
      const newFlashcard = generateFlashcard(questionNode.id, n, note);
      cardsToCreate.push(newFlashcard);
    });

    cardsToRemove.forEach((card) => {
      if (card.deleted === true) return;
      console.warn("delete cloze", card.clozeNumber);
      const obj = getFlashcardFromDoc(card);
      newDeletedFlashcards[obj.id] = obj;
      bulkRemove.push(card.id);
    });
    cardsToCreate.forEach((card) => {
      const oldCard: Flashcard | undefined = newDeletedFlashcards[card.id];
      console.warn("insert cloze", card.clozeNumber);
      if (!oldCard) {
        bulkInsert.push(card);
      } else {
        delete newDeletedFlashcards[oldCard.id];
        bulkInsert.push(oldCard);
      }
    });
  });

  if (!isEmpty(bulkRemove)) flashcardcollection.bulkRemove(bulkRemove);
  if (!isEmpty(bulkInsert)) flashcardcollection.bulkInsert(bulkInsert);
  note.atomicPatch({
    data: { ...note.data, deletedFlashcards: newDeletedFlashcards },
  });
};
