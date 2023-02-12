import { SlateBaseProperties } from "main/database/schemas/nodeSchema";
import { NodesHashTable } from "main/database/schemas/noteSchema";

export const getHashTableFromNodes = (nodes: SlateBaseProperties[]) => {
  const newHashTable = nodes.reduce((prev, curr) => {
    const newObj = { ...prev };
    newObj[curr.id] = curr;
    return newObj;
  }, {} as NodesHashTable);

  return newHashTable;
};
