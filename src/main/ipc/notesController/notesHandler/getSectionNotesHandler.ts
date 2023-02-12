import { uuidSchemaArray } from "main/database/miscSchemas/uuidSchema";
import { UserDocument } from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { validator } from "main/ipc/validator";

export const getSectionNotesHandler = async (
  user: UserDocument,
  db: RxMyDatabase,
  unkownSectionIds: unknown
) => {
  const sectionIds = validator<string[]>(unkownSectionIds, uuidSchemaArray);

  const oldNotes = await db.notecollection
    .find({
      selector: { parent: { $in: sectionIds }, "data.owner": user.username },
    })
    .exec();

  const notes = oldNotes.map((n) => n.toJSON());
  return { message: "Got source", data: notes };
};
