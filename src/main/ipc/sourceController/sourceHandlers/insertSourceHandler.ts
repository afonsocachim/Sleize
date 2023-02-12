import {
  ajvSourceSchema,
  BaseSource,
  Source,
} from "main/database/schemas/sourceSchema";
import { UserDocument } from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { validator } from "main/ipc/validator";

export const insertSourceHandler = async (
  user: UserDocument,
  db: RxMyDatabase,
  unknownNewSource: unknown
) => {
  const s = validator<BaseSource>(unknownNewSource, ajvSourceSchema) as Source;

  if (user.username !== s.owner)
    throw Error("Tried to add source with incorrect owner");

  const oldSource = await db.sourcecollection
    .findOne({ selector: { id: s.id } })
    .exec();
  if (oldSource) throw Error("Source already exists");

  await await db.sourcecollection.insert(s);
  return { message: "Source inserted", data: s };
};
