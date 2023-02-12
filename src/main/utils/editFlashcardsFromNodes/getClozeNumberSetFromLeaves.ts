import { cloneDeep } from "lodash";
import { Leaf } from "../../database/schemas/nodeSchema";

export const getClozeNumberSetFromLeaves = (children: Leaf[]) => {
  const originalClozeChildren: number[] = children.map((child) => {
    if (typeof child.clozeNumber !== "number") return -1;
    return child.clozeNumber;
  });
  const originalClozeArray: number[] = originalClozeChildren.filter(
    (clozeNumber) => clozeNumber > -1
  );
  const allClozeNumbers = cloneDeep(originalClozeArray);
  const clozeNumberSet = new Set(allClozeNumbers);
  return clozeNumberSet;
};
