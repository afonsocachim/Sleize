import {
  ajvFlashcardSchema,
  Flashcard,
} from "main/database/schemas/flashcardSchema";
import { UserDocument } from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { validator } from "main/ipc/validator";

export const updateFlashcardHandler = async (
  user: UserDocument,
  db: RxMyDatabase,
  unknownNewFlashcard: unknown
) => {
  const f = validator<Flashcard>(unknownNewFlashcard, ajvFlashcardSchema);
  const partialFlashcard: Partial<Flashcard> = { ...f };
  const oldFlashcard = await db.flashcardcollection
    .findOne({ selector: { id: f.id } })
    .exec();
  if (!oldFlashcard) throw Error("No flashcard");
  if (oldFlashcard.owner !== user.username) throw Error("User not owner");

  // need to remove primary key b4 update
  delete partialFlashcard.id;
  await oldFlashcard.atomicPatch(partialFlashcard);
  const newFlashcard = oldFlashcard.toJSON();
  return { message: "Source updated", data: newFlashcard };
};
