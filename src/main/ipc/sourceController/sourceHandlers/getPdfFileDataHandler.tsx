import { checkFileExistence } from "main/utils/checkFileExistence";
import { validator } from "main/ipc/validator";
import {
  ajvSourceSchema,
  BaseSource,
  Source,
} from "main/database/schemas/sourceSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { UserDocument } from "main/database/schemas/userSchema";
import { FileData } from "main/database/schemas/fileDataSchema";
import { LocalFileData } from "main/utils/LocalFileData";

export const getPdfFileDataHandler = async (
  user: UserDocument,
  db: RxMyDatabase,
  unknownSource: unknown
) => {
  const s = validator<BaseSource>(unknownSource, ajvSourceSchema) as Source;
  const source = await db.sourcecollection
    .findOne({
      selector: { owner: user.username, id: s.id },
    })
    .exec();
  if (!source) throw Error("No source found");
  const { path, type } = source;
  const validType = type === "ONLINE_ARTICLE" || type === "LOCAL_PDF";
  if (!validType) throw Error("Invalid source type");
  const isValidPath = checkFileExistence(path);
  if (!isValidPath) throw Error("Invalid file path");
  const pdfFileData: FileData = new LocalFileData(path);

  return {
    message: "Video ready",
    data: pdfFileData,
  };
};
