import {
  ajvUserSchema,
  User,
  UserDocument,
} from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { validator } from "main/ipc/validator";

export const updateUserHandler = async (
  user: UserDocument,
  db: RxMyDatabase,
  unknownNewUser: unknown
) => {
  const u = validator<User>(unknownNewUser, ajvUserSchema);
  const partialUser: Partial<User> = { ...u };
  console.log("u", JSON.stringify(u));
  // need to remove primary key b4 update
  delete partialUser.username;
  await user.atomicPatch(partialUser);
  const newUser = user.toJSON();
  return { message: "User updated", data: newUser };
};
