import { ipcMain } from "electron";
import { User } from "main/database/schemas/userSchema";
import { errorWrapper } from "../errorWrapper";
import { errorWrapperNoUser } from "../errorWrapperNoUser";
import { createUserHandler } from "./userHandlers/createUserHandler/createUserHandler";
import { loginUserHandler } from "./userHandlers/loginUserHandler";
import { updateUserHandler } from "./userHandlers/updateUserHandler";
import { userSourceLister } from "./userListers/userSourceLister";
import { userNoteLister } from "./userListers/userNoteLister";
import { userFlashcardLister } from "./userListers/userFlashcardLister";

export const userController = () => {
  userSourceLister("users/list/sources");
  userNoteLister("users/list/notes");
  userFlashcardLister("users/list/flashcards");

  ipcMain.handle(
    "users/update",
    async (event, username: string, password: string, user: User) => {
      const wrapped = errorWrapper(username, password, updateUserHandler);
      const response = await wrapped(user);
      return response;
    }
  );

  ipcMain.handle(
    "users/login",
    async (event, username: string, password: string) => {
      console.log("login", event, username, password);
      const wrapped = errorWrapper(username, password, loginUserHandler);
      const response = await wrapped();
      return response;
    }
  );

  ipcMain.handle(
    "users/create",
    async (event, username: string, password: string) => {
      const wrapped = errorWrapperNoUser(createUserHandler);
      const response = await wrapped(username, password);
      return response;
    }
  );
};
