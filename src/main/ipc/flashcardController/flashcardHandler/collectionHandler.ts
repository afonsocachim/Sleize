import { UserDocument } from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";

export const collectionHandler = async (
  user: UserDocument,
  db: RxMyDatabase
) => {
  const collections = await db.collections;
  return { message: "Note cards listed", data: collections };
};
