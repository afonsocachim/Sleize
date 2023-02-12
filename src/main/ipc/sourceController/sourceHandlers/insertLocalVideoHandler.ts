import { v4 } from "uuid";
import { dialog } from "electron";
import { Source } from "main/database/schemas/sourceSchema";
import { getNameFromPath } from "main/utils/getNameFromPath";
import { UserDocument } from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { insertSourceHandler } from "./insertSourceHandler";

export const insertLocalVideoHandler = async (
  user: UserDocument,
  db: RxMyDatabase
) => {
  const { username } = user;
  const insertVideo = async (videoPath: string) => {
    const newVideo: Source = {
      id: v4(),
      type: "LOCAL_VIDEO",
      path: videoPath,
      parent: "root",
      owner: username,
      name: getNameFromPath(videoPath),
      highlights: [],
    };

    await insertSourceHandler(user, db, newVideo);
  };

  const result: { filePaths: string[] } = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "Movies", extensions: ["mkv", "avi", "mp4"] }],
  });
  const pathArr = result.filePaths;
  await Promise.all(
    pathArr.map(async (path: string) => {
      await insertVideo(path);
      return null;
    })
  );

  return { message: "Inserted video", data: null };
};
