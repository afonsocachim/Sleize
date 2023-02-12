import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";
import {
  Marks,
  marksArray,
  Leaf,
  ajvLeafSchema,
  ajvMarkSchema,
} from "./leafSchema";
import {
  BaseSlateSource,
  SlateVideoSource,
  SlatePdfSource,
  SlateSource,
  ajvSlateSource,
} from "./slateSourceSchema";
import {
  Headings,
  headingArray,
  BlockTypes,
  ajvBlockTypeSchema,
  blockTypesArray,
} from "./blockTypeSchema";
import {
  Shapes,
  ajvShapeSchema,
  SvgObject,
  ajvSvgObject,
  SlateImageProp,
  SlateImageObjOrNull,
  ajvSchemaSlateImageProp,
} from "./slateImageSchema";

import {
  SlateBaseProperties,
  SlateParagraph,
  SlateQuestion,
  SlateHeading,
  SlateImage,
  SlateElement,
  ajvSlateNodeSchema,
} from "./slateNodeSchema";

export { Marks, marksArray, Leaf, ajvLeafSchema, ajvMarkSchema };

export {
  BaseSlateSource,
  SlateVideoSource as VideoSource,
  SlatePdfSource as PdfSource,
  SlateSource,
  ajvSlateSource,
};

export {
  Headings,
  headingArray,
  BlockTypes,
  ajvBlockTypeSchema,
  blockTypesArray,
};

export {
  Shapes,
  ajvShapeSchema,
  SvgObject,
  ajvSvgObject,
  SlateImageProp,
  SlateImageObjOrNull,
  ajvSchemaSlateImageProp,
};

export {
  SlateBaseProperties,
  SlateParagraph,
  SlateQuestion,
  SlateHeading,
  SlateImage,
  SlateElement,
  ajvSlateNodeSchema,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlateAttributes = any;

export type SlateEditor = BaseEditor & ReactEditor & HistoryEditor;

declare module "slate" {
  interface CustomTypes {
    Editor: SlateEditor;
    Element: SlateElement;
    Text: Leaf;
  }
}
