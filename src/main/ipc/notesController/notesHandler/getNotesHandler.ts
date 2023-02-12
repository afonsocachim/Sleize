import { uuidSchemaArray } from "main/database/miscSchemas/uuidSchema";
import { UserDocument } from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { validator } from "main/ipc/validator";

export const getNotesHandler = async (
  user: UserDocument,
  db: RxMyDatabase,
  unkownNoteId: unknown
) => {
  const noteIds = validator<string[]>(unkownNoteId, uuidSchemaArray);

  const oldNotes = await db.notecollection
    .find({
      selector: { id: { $in: noteIds }, "data.owner": user.username },
    })
    .exec();
  if (oldNotes.length !== noteIds.length) throw Error("User not owner");

  const notes = oldNotes.map((n) => n.toJSON());
  return { message: "Got source", data: notes };
};
