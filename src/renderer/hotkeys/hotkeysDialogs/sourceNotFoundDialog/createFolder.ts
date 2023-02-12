import { FolderSource } from "main/database/schemas/sourceSchema";
import { insertSourceInvoker } from "renderer/ipc/sourceInvokers";
import { userStore } from "renderer/store/userStore";
import { v4 } from "uuid";
import { sourceTreeStore } from "./sourceTreeStore";

export const createFolder = (name: string) => {
  const { user } = userStore.getState();
  if (!user) throw Error("no user");
  const { directory } = sourceTreeStore.getState();
  const lastDirectory = directory[directory.length - 1];
  if (typeof lastDirectory.id !== "string")
    throw Error("lastDirectory.id not a string");
  const newFolder: FolderSource = {
    id: v4(),
    owner: user.username,
    type: "FOLDER",
    name,
    parent: lastDirectory.id,
    path: `\\${name}.folder`,
    highlights: [],
  };
  insertSourceInvoker(newFolder);
};
