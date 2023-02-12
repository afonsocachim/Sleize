import { uuidSchemaArray } from "main/database/miscSchemas/uuidSchema";
import { UserDocument } from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { validator } from "main/ipc/validator";

export const removeNotesHandler = async (
  user: UserDocument,
  db: RxMyDatabase,
  unknownNoteIds: unknown
) => {
  const noteIds = validator<string[]>(unknownNoteIds, uuidSchemaArray);
  const actualNotes = await db.notecollection
    .find({
      selector: { "data.owner": user.username, id: { $in: noteIds } },
    })
    .exec();

  if (actualNotes.length !== noteIds.length) throw Error("User not owner");
  const actualNotesIds = actualNotes.map((n) => n.id);
  const flashcards = await db.flashcardcollection
    .find({ selector: { noteId: { $in: noteIds } } })
    .exec();
  await db.notecollection.bulkRemove(actualNotesIds);
  await db.flashcardcollection.bulkRemove(flashcards.map((f) => f.id));
  return { message: "Notes deleted", data: null };
};
