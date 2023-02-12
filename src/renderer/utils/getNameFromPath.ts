export const getNameFromPath = (fullPath: string) => {
  const filename = fullPath.replace(/^.*[\\/]/, "");
  return filename;
};
