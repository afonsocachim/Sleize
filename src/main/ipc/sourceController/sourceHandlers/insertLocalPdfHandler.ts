import { v4 } from "uuid";
import { dialog } from "electron";
import { Source } from "main/database/schemas/sourceSchema";
import { getNameFromPath } from "main/utils/getNameFromPath";
import { UserDocument } from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { insertSourceHandler } from "./insertSourceHandler";

export const insertLocalPdfHandler = async (
  user: UserDocument,
  db: RxMyDatabase
) => {
  const { username } = user;
  const insertPdf = async (pdfPath: string) => {
    const newVideo: Source = {
      id: v4(),
      type: "LOCAL_PDF",
      path: pdfPath,
      parent: "root",
      owner: username,
      name: getNameFromPath(pdfPath),
      highlights: [],
    };

    await insertSourceHandler(user, db, newVideo);
  };

  const result: { filePaths: string[] } = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "Pdf", extensions: ["pdf"] }],
  });
  const pathArr = result.filePaths;
  await Promise.all(
    pathArr.map(async (path: string) => {
      await insertPdf(path);
      return null;
    })
  );

  return { message: "Inserted Pdf", data: null };
};
