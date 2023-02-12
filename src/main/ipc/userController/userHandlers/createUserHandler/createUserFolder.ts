import fs from "fs";
import { app } from "electron";

export const createUserFolder = (username: string) => {
  const dir = `${app.getPath("userData")}\\UserDocuments\\${username}\\`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
