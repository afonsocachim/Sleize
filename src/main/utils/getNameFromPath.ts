export const getNameFromPath = (fullPath: string) => {
  const fileNameWithExtension = fullPath.split(/(\\|\/)/g).pop();
  if (!fileNameWithExtension) throw Error("No fileName");
  const fileName = fileNameWithExtension.split(".")[0];
  return fileName;
};
