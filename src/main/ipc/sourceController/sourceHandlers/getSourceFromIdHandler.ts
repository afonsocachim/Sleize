import { uuidSchema } from "main/database/miscSchemas/uuidSchema";
import { UserDocument } from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { validator } from "main/ipc/validator";

export const getSourceFromIdHandler = async (
  user: UserDocument,
  db: RxMyDatabase,
  unknownSourceId: unknown
) => {
  const sourceId = validator<string>(unknownSourceId, uuidSchema);

  const source = await db.sourcecollection
    .findOne({ selector: { id: sourceId } })
    .exec();
  if (!source) throw Error("Source does not exist");
  if (source.owner !== user.username) throw Error("Invalid owner");

  const sourceObj = source.toJSON();

  return { message: "Source found", data: sourceObj };
};
