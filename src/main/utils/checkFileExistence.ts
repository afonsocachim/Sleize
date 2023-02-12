const fs = require("fs");

export const checkFileExistence = (path: string) => {
  let fileExists = false;
  try {
    if (fs.existsSync(path)) {
      fileExists = true;
    }
  } catch (error) {
    console.error(error);
  }
  return fileExists;
};
