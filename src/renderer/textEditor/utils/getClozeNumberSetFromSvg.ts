import { cloneDeep } from "lodash";
import { SvgObject } from "renderer/svgEditor/types";

export const getClozeNumberSetFromSvg = (children: SvgObject[]) => {
  const originalClozeArray = children.map((svg) => svg.cardNumber);
  const allClozeNumbers = cloneDeep(originalClozeArray);
  const clozeNumberSet = new Set(allClozeNumbers);
  return clozeNumberSet;
};
