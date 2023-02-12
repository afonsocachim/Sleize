import { UserDocument } from "main/database/schemas/userSchema";
import { mainStore } from "main/store/mainStore";

export const loginUserHandler = async (user: UserDocument) => {
  mainStore.setState({ user });
  const newUser = user.toJSON();
  return { message: "Welcome!", data: newUser };
};
