import { JSONSchemaType } from "ajv";
import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";
import { isoStringSchema } from "../miscSchemas/isoDateStringSchema";
import { uuidSchema } from "../miscSchemas/uuidSchema";
import { ajvUsernameSchema } from "./userSchema";

export type SuperMemoItem = {
  interval: number;
  repetition: number;
  efactor: number;
};

export type SuperMemoGrade = 0 | 1;

export type Flashcard = {
  id: string;
  owner: string;
  clozeNumber: number;
  nodeId: string;
  noteId: string;
  interval: number;
  repetition: number;
  efactor: number;
  dueDate: string;
};
export type FlashcardDocument = RxDocument<Flashcard>;

export type FlashcardCollection = RxCollection<Flashcard>;

export const ajvFlashcardSchema: JSONSchemaType<Flashcard> = {
  type: "object",
  properties: {
    interval: { type: "number" },
    repetition: { type: "number" },
    efactor: { type: "number" },
    id: { type: "string" },
    owner: ajvUsernameSchema,
    dueDate: isoStringSchema,
    clozeNumber: { type: "number" },
    nodeId: uuidSchema,
    noteId: uuidSchema,
  },
  required: [
    "interval",
    "repetition",
    "efactor",
    "id",
    "owner",
    "dueDate",
    "clozeNumber",
    "nodeId",
    "noteId",
  ],
};

export const flashcardSchema: RxJsonSchema<Flashcard> = {
  type: "object",
  primaryKey: {
    // where should the composed string be stored
    key: "id",
    // fields that will be used to create the composed key
    fields: ["nodeId", "clozeNumber"],
    // separator which is used to concat the fields values.
    separator: "|",
  },
  properties: {
    interval: { type: "number" },
    repetition: { type: "number" },
    efactor: { type: "number" },
    id: { type: "string" },
    owner: { type: "string" },
    dueDate: { type: "string" },
    clozeNumber: { type: "number" },
    nodeId: { type: "string" },
    noteId: { type: "string" },
  },
  version: 0,
  indexes: ["noteId", "nodeId", "dueDate", "owner"],
  required: [
    "interval",
    "repetition",
    "efactor",
    "id",
    "owner",
    "dueDate",
    "clozeNumber",
    "nodeId",
    "noteId",
  ],
};
