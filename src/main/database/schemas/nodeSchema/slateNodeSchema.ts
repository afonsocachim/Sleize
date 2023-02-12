import { JSONSchemaType } from "ajv";
import { uuidSchema } from "main/database/miscSchemas/uuidSchema";
import { Leaf, ajvLeafSchema } from "./leafSchema";
import {
  SlateSource,
  ajvSlateSource,
  SlatePdfSource,
} from "./slateSourceSchema";
import { Headings, BlockTypes } from "./blockTypeSchema";
import {
  SlateImageProp,
  SlateImageObjOrNull,
  ajvSchemaSlateImageProp,
} from "./slateImageSchema";

export type SlateBaseProperties = {
  id: string;
  blockType: BlockTypes;
  children: Leaf[];
  source: SlateSource;
  list: boolean;
  image: SlateImageObjOrNull;
  nestedNodes: SlateBaseProperties[] | never[];
};

export type SlateParagraph = SlateBaseProperties & {
  blockType: BlockTypes & "Paragraph";
  image: null;
  nestedNodes: never[];
};

export type SlateQuestion = SlateBaseProperties & {
  blockType: BlockTypes & "Question";
  image: null;
  nestedNodes: never[];
};

export type SlateHeading = SlateBaseProperties & {
  blockType: BlockTypes & Headings;
  list: false;
  image: null;
  nestedNodes: SlateBaseProperties[];
};

export type SlateImage = SlateBaseProperties & {
  blockType: BlockTypes & "Image";
  list: false;
  source: SlatePdfSource | null;
  image: SlateImageProp;
  nestedNodes: never[];
};

export type SlateCode = SlateBaseProperties & {
  blockType: BlockTypes & "Code";
  list: false;
  source: SlatePdfSource | null;
  image: null;
  nestedNodes: never[];
};

export type SlateElement = SlateBaseProperties &
  (SlateParagraph | SlateHeading | SlateQuestion | SlateImage | SlateCode);

export const ajvSlateNodeSchema: JSONSchemaType<SlateBaseProperties> = {
  $id: "ajv_slate_node_schema",
  type: "object",
  properties: {
    id: uuidSchema,
    blockType: {
      type: "string",
      enum: [
        "Image",
        "Paragraph",
        "Question",
        "Code",
        "Heading 1",
        "Heading 2",
        "Heading 3",
        "Heading 4",
        "Heading 5",
        "Heading 6",
      ],
    },
    children: { type: "array", items: ajvLeafSchema },
    list: { type: "boolean" },
    source: ajvSlateSource,
    image: ajvSchemaSlateImageProp,
    nestedNodes: {
      type: "array",
      items: {
        type: "object",
        $ref: "ajv_slate_node_schema",
        required: [
          "id",
          "blockType",
          "children",
          "source",
          "list",
          "image",
          "nestedNodes",
        ],
      },
    },
  },
  required: ["id", "blockType", "children", "list", "image", "nestedNodes"],
};
