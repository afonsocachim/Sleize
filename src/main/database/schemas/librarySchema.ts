import { JSONSchemaType } from "ajv";
import { titleSchema } from "../miscSchemas/titleSchema";
import { uuidSchema } from "../miscSchemas/uuidSchema";

export type SectionObj = {
  id: string;
  title: string;
};

export const ajvSectionSchema: JSONSchemaType<SectionObj> = {
  type: "object",
  properties: {
    id: uuidSchema,
    title: titleSchema,
  },
  required: ["id", "title"],
};

export type SectionHash = {
  [any: string]: SectionObj;
};

export const ajvSectionHash: JSONSchemaType<SectionHash> = {
  type: "object",
  patternProperties: {
    "^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$":
      ajvSectionSchema,
  },
  additionalProperties: false,
  required: [],
};

export type NotebookObj = {
  id: string;
  title: string;
  sectionIds: string[];
};

export const ajvNotebookSchema: JSONSchemaType<NotebookObj> = {
  type: "object",
  properties: {
    id: uuidSchema,
    title: titleSchema,
    sectionIds: { type: "array", items: uuidSchema },
  },
  required: ["id", "title", "sectionIds"],
};

export type NotebookHash = {
  [any: string]: NotebookObj;
};

export const ajvNotebookHash: JSONSchemaType<NotebookHash> = {
  type: "object",
  patternProperties: {
    "^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$":
      ajvNotebookSchema,
  },
  additionalProperties: false,
  required: [],
};

export type LibraryState = {
  sections: SectionHash;
  notebooks: NotebookHash;
  notebookOrder: string[];
};

export const ajvLibraryHash: JSONSchemaType<LibraryState> = {
  type: "object",
  properties: {
    sections: ajvSectionHash,
    notebooks: ajvNotebookHash,
    notebookOrder: { type: "array", items: uuidSchema },
  },
  required: ["sections", "notebooks", "notebookOrder"],
};
