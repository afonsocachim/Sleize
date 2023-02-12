import { JSONSchemaType } from "ajv";

export type Headings =
  | "Heading 1"
  | "Heading 2"
  | "Heading 3"
  | "Heading 4"
  | "Heading 5"
  | "Heading 6";

export const headingArray: Headings[] = [
  "Heading 1",
  "Heading 2",
  "Heading 3",
  "Heading 4",
  "Heading 5",
  "Heading 6",
];

export type BlockTypes = "Paragraph" | "Question" | "Image" | "Code" | Headings;

export const ajvBlockTypeSchema: JSONSchemaType<BlockTypes> = {
  type: "string",
  enum: [
    "Paragraph",
    "Question",
    "Image",
    "Code",
    "Heading 1",
    "Heading 2",
    "Heading 3",
    "Heading 4",
    "Heading 5",
    "Heading 6",
  ],
};

export const blockTypesArray: BlockTypes[] = [
  "Paragraph",
  "Question",
  "Code",
  "Heading 1",
  "Heading 2",
  "Heading 3",
  "Heading 4",
  "Heading 5",
  "Heading 6",
];
