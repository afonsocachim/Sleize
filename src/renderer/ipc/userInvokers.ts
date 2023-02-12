import { User } from "main/database/schemas/userSchema";
import { toast } from "react-toastify";
import { userStore } from "renderer/store/userStore";
import { navStore } from "../store/navStore";
import { Invoker, invokeWrapper } from "./invokeWrapper";

export const updateUserInvoker = async (
  partialUser: Partial<User>
): Invoker => {
  const oldUser = userStore.getState().user;
  if (!oldUser) throw Error("No user");
  const newUser: User = { ...oldUser, ...partialUser };
  const result = await invokeWrapper(
    "users/update",
    oldUser.username,
    oldUser.password,
    newUser
  );
  const { error, message, data } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  userStore.setState({ user: data });
  return result;
};

export const loginUserInvoker = async (
  username: string,
  password: string
): Invoker => {
  const result = await invokeWrapper("users/login", username, password);
  const { error, message, data } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  toast.success(message);
  userStore.setState({ user: data });
  navStore.getState().nav("/app");
  return result;
};

export const createUserInvoker = async (
  username: string,
  password: string
): Invoker => {
  const result = await invokeWrapper("users/create", username, password);
  const { error, message } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  toast.success(message);

  navStore.getState().nav("/");
  return result;
};

// TODO:
