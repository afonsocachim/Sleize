import { FileData } from "main/database/schemas/fileDataSchema";

export const constructFileFromLocalFileData = (localFileData: FileData) => {
  return new File(localFileData.arrayBuffer, localFileData.name, {
    type: localFileData.type,
  });
};
