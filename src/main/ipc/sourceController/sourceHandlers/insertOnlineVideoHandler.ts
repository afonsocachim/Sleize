import { v4 } from "uuid";
import { UserDocument } from "main/database/schemas/userSchema";
import { VideoSource } from "main/database/schemas/sourceSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { validator } from "main/ipc/validator";
import { validateUrl } from "main/ipc/validateUrl";
import { titleSchema } from "main/database/miscSchemas/titleSchema";

export const insertOnlineVideoHandler = async (
  user: UserDocument,
  db: RxMyDatabase,
  unknownUrl: unknown,
  unknownName: unknown
) => {
  const owner = user.username;
  const name = validator<string>(unknownName, titleSchema);
  const url = validateUrl(unknownUrl);
  const videoId = v4();

  const pdfSource: VideoSource = {
    id: videoId,
    owner,
    type: "ONLINE_VIDEO",
    name,
    path: url,
    parent: "root",
    highlights: [],
  };
  await db.sourcecollection.insert(pdfSource);
  return { message: "Video added", data: pdfSource };
};
