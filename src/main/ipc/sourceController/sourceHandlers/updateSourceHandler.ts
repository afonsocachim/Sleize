import {
  ajvSourceSchema,
  BaseSource,
  Source,
} from "main/database/schemas/sourceSchema";
import { UserDocument } from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { validator } from "main/ipc/validator";

export const updateSourceHandler = async (
  user: UserDocument,
  db: RxMyDatabase,
  unknownNewSource: unknown
) => {
  const s = validator<BaseSource>(unknownNewSource, ajvSourceSchema) as Source;
  const partialSource: Partial<Source> = { ...s };
  const oldSource = await db.sourcecollection
    .findOne({ selector: { id: s.id } })
    .exec();
  if (!oldSource) throw Error("No old source");
  if (s.owner !== user.username) throw Error("User not owner");

  // need to remove primary key b4 update
  delete partialSource.id;
  await oldSource.atomicPatch(partialSource);
  const newSource = oldSource.toJSON();
  return { message: "Source updated", data: newSource };
};
