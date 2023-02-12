import { dialog } from "electron";
import {
  ajvSourceSchema,
  BaseSource,
  Source,
} from "main/database/schemas/sourceSchema";
import { getNameFromPath } from "main/utils/getNameFromPath";
import { UserDocument } from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { validator } from "main/ipc/validator";
import { updateSourceHandler } from "./updateSourceHandler";

export const updateLocalSourcePathHandler = async (
  user: UserDocument,
  db: RxMyDatabase,
  unknownOldSource: unknown
) => {
  const oldSource = validator<BaseSource>(
    unknownOldSource,
    ajvSourceSchema
  ) as Source;
  const { owner, type } = oldSource;
  const { username } = user;
  if (username !== owner) throw Error("User not owner");
  const validType = type === "LOCAL_PDF" || type === "LOCAL_VIDEO";
  if (!validType) throw Error("Source is not a local file");
  let filters = [{ name: "Pdf", extensions: ["pdf"] }];
  if (type === "LOCAL_VIDEO")
    filters = [{ name: "Movies", extensions: ["mkv", "avi", "mp4"] }];

  const updatePath = async (newPath: string) => {
    const newSource: Source = {
      ...oldSource,
      path: newPath,
      name: getNameFromPath(newPath),
    };

    await updateSourceHandler(user, db, newSource);
  };

  const result: { filePaths: string[] } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters,
  });
  const pathArr = result.filePaths;
  await Promise.all(
    pathArr.map(async (path: string) => {
      await updatePath(path);
      return null;
    })
  );

  return { message: "Inserted videos", data: null };
};
