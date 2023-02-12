import { uuidSchemaArray } from "main/database/miscSchemas/uuidSchema";
import { UserDocument } from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { validator } from "main/ipc/validator";

export const bulkRemoveSourceHandler = async (
  user: UserDocument,
  db: RxMyDatabase,
  unknownIdArray: unknown
) => {
  const ids = validator<string[]>(unknownIdArray, uuidSchemaArray);
  const docs = await db.sourcecollection
    .find({
      selector: { id: { $in: ids }, owner: user.username },
    })
    .exec();
  if (docs.length !== ids.length) throw Error("Invalid user");
  await db.sourcecollection.bulkRemove(ids);

  return { message: "Source updated", data: null };
};
