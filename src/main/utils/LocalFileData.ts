import path from "path";
import fs from "fs";
import mimeTypes from "mime-types";
import { FileData } from "main/database/schemas/fileDataSchema";

class LocalFileData {
  arrayBuffer: FileData["arrayBuffer"];

  name: string;

  type: string;

  constructor(localFilePath: string) {
    this.arrayBuffer = (() => {
      const buffer = fs.readFileSync(localFilePath);
      const arrayBuffer = buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      );
      return [arrayBuffer];
    })();
    this.name = path.basename(localFilePath);
    this.type = mimeTypes.lookup(path.extname(localFilePath)) || "";
  }
}

export { LocalFileData };
