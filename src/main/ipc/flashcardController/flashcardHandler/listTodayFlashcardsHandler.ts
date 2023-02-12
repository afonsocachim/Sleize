import { uuidSchemaArray } from "main/database/miscSchemas/uuidSchema";
import { UserDocument } from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { validator } from "main/ipc/validator";
import { mainStore } from "main/store/mainStore";

export const listTodayFlashcardsHandler = async (
  user: UserDocument,
  db: RxMyDatabase,
  unknownNoteIds: unknown
) => {
  const noteIds = validator<string[]>(unknownNoteIds, uuidSchemaArray);
  const { lastMinuteOfToday } = mainStore.getState();
  const userNotes = await db.notecollection
    .find({
      selector: { "data.owner": user.username, id: { $in: noteIds } },
    })
    .exec();
  if (userNotes.length !== noteIds.length) throw Error("User not owner");
  const userNotesIds = userNotes.map((n) => n.id);
  const docs = await db.flashcardcollection
    .find({
      selector: {
        owner: user.username,
        noteId: { $in: userNotesIds },
        dueDate: { $lte: lastMinuteOfToday },
      },
      sort: [{ dueDate: "asc" }],
    })
    .exec();
  const cards = docs.map((d) => d.toJSON());
  return { message: "Note cards listed", data: cards };
};
