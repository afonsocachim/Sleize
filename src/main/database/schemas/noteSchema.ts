import { JSONSchemaType } from "ajv";
import { RxDocument, RxJsonSchema, RxCollection } from "rxdb";
import { ajvSlateNodeSchema, SlateBaseProperties } from "./nodeSchema";
import { ajvFlashcardSchema, Flashcard } from "./flashcardSchema";
import { uuidPattern, uuidSchema } from "../miscSchemas/uuidSchema";
import { minStringSchema } from "../miscSchemas/minStringSchema";
import { titleSchema } from "../miscSchemas/titleSchema";
import { UncheckedJSONSchemaType } from "main/ipc/UncheckedJSONSchemaType";

export type NodesHashTable = { [nodeId: string]: SlateBaseProperties };

export type Note = {
  id: string;
  parent: string;
  text: string; // noteTitle
  droppable: boolean;
  data: {
    owner: string;
    nodes: SlateBaseProperties[];
    deletedFlashcards: { [flashcardId: string]: Flashcard };
  };
};

const patternProperties: {
  [key: string]: UncheckedJSONSchemaType<Flashcard, false>;
} = {};
patternProperties[uuidPattern] = ajvFlashcardSchema;

export const ajvNoteSchema: JSONSchemaType<Note> = {
  type: "object",
  properties: {
    id: uuidSchema,
    // TODO: CHANGE PARENT TO UUID SCHEMA
    parent: { type: "string" },
    // text === title
    text: titleSchema,
    droppable: { type: "boolean" },
    data: {
      type: "object",
      properties: {
        owner: { type: "string" },
        nodes: { type: "array", items: ajvSlateNodeSchema },
        deletedFlashcards: {
          type: "object",
          patternProperties,
          required: [],
        },
      },
      required: ["owner", "nodes", "deletedFlashcards"],
    },
  },
  required: ["id", "parent", "text", "data"],
};

export type NoteDocument = RxDocument<Note>;

export type NoteCollection = RxCollection<Note>;

export const noteSchema: RxJsonSchema<Note> = {
  version: 0,
  title: "Note schema",
  keyCompression: true,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string" },
    parent: { type: "string" },
    text: { type: "string" },
    droppable: { type: "boolean" },
    data: {
      type: "object",
      properties: {
        owner: { type: "string" },
        nodes: { type: "array" },
        deletedFlashcards: { type: "object" },
      },
      required: ["owner", "nodes", "deletedFlashcards"],
    },
  },
  required: ["id", "parent", "text", "data"],
};
