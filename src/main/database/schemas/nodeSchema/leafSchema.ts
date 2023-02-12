import { JSONSchemaType } from "ajv";

export type Marks = "bold" | "italic" | "underline" | "clozeNumber";

export const ajvMarkSchema: JSONSchemaType<Marks> = {
  type: "string",
  enum: ["bold", "italic", "underline", "clozeNumber"],
};

export const marksArray: Marks[] = ["bold", "italic", "underline"];

export type Leaf = {
  text: string;
  highlight?: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  clozeNumber?: number;
};

export const ajvLeafSchema: JSONSchemaType<Leaf> = {
  type: "object",
  properties: {
    text: { type: "string" },
    highlight: { type: "boolean", nullable: true },
    bold: { type: "boolean", nullable: true },
    italic: { type: "boolean", nullable: true },
    underline: { type: "boolean", nullable: true },
    clozeNumber: { type: "integer", nullable: true },
  },
  required: ["text"],
};
