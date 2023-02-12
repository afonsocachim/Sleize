import fs from "fs";
import { userDocuments } from "main/pathsToCreate";
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

const { parse, stringify } = require("subtitle");

const getSubPath = async (
  videoPath: string,
  videoType: string,
  videoId: string
) => {
  if (!videoPath) return null;
  if (videoType !== "LOCAL_VIDEO") return null;
  const isValidPath = checkFileExistence(videoPath);
  // Error message used in renderer, don't forget to change in both
  if (!isValidPath) throw Error("Invalid file path");

  const shortPath = videoPath.slice(0, videoPath.lastIndexOf("."));
  const srtPath = `${shortPath}.srt`;
  const localVttPath = `${shortPath}.vtt`;
  const docVttPath = `${userDocuments}${videoId}.vtt`;
  const hasLocalVtt = checkFileExistence(localVttPath);
  if (hasLocalVtt) {
    return localVttPath;
  }
  const hasDocVtt = checkFileExistence(docVttPath);
  if (hasDocVtt) {
    return docVttPath;
  }
  const hasSrt = checkFileExistence(srtPath);
  if (!hasLocalVtt && !hasDocVtt && hasSrt) {
    const promise = new Promise((resolve, reject) => {
      fs.createReadStream(srtPath)
        .pipe(parse())
        .pipe(stringify({ format: "WebVTT" }))
        .pipe(fs.createWriteStream(docVttPath))
        .on("error", reject)
        .on("finish", () => resolve(docVttPath));
    });
    await promise;
    return docVttPath;
  }
  return null;
};

export const getVideoAndSubBufferHandler = async (
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
  const { path, type, id } = source;
  if (type !== "LOCAL_VIDEO") throw Error("Source not local video");
  const isValidPath = checkFileExistence(path);
  if (!isValidPath) throw Error("Invalid file path");
  const videoFileData: FileData = new LocalFileData(path);
  const subPath = await getSubPath(path, type, id);
  let subFileData: FileData | null = null;
  if (subPath) {
    const isValidSubPath = checkFileExistence(subPath);
    if (isValidSubPath) {
      subFileData = new LocalFileData(subPath);
    }
  }

  return {
    message: "Video ready",
    data: { subFileData, videoFileData },
  };
};
