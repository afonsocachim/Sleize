import fs from "fs";
import { pathsToCreate } from "./pathsToCreate";

export const createFolders = () => {
  pathsToCreate.forEach((path) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  });
};
