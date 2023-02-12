import { RxJsonSchema, RxDocument, RxCollection } from "rxdb";
import {
  HighlightViewport,
  ajvViewportPosition,
} from "main/database/schemas/highlightSchema";
import { JSONSchemaType } from "ajv";
import { uuidSchema } from "../miscSchemas/uuidSchema";
import { ajvUsernameSchema } from "./userSchema";
import { pathSchema } from "../miscSchemas/pathSchema";
import { titleSchema } from "../miscSchemas/titleSchema";

export type FileSourceTypes =
  | "LOCAL_PDF"
  | "ONLINE_ARTICLE"
  | "LOCAL_VIDEO"
  | "ONLINE_VIDEO";

export const fileSourceTypesArray = [
  "LOCAL_PDF",
  "ONLINE_ARTICLE",
  "LOCAL_VIDEO",
  "ONLINE_VIDEO",
];

export type BaseSourceTypes = FileSourceTypes | "FOLDER";

export type FileSource = {
  id: string;
  owner: string;
  type: FileSourceTypes;
  name: string;
  path: string;
  parent: string;
  highlights: HighlightViewport[];
};

export type BaseSource = {
  id: string;
  owner: string;
  type: BaseSourceTypes;
  name: string;
  path: string;
  parent: string;
  highlights: HighlightViewport[] | never[];
};

export type LocalPdfSource = BaseSource & {
  id: string;
  owner: string;
  type: "LOCAL_PDF" | "ONLINE_ARTICLE";
  name: string;
  path: string;
  parent: string;
  highlights: HighlightViewport[];
};

export type VideoSource = BaseSource & {
  id: string;
  owner: string;
  type: "LOCAL_VIDEO" | "ONLINE_VIDEO";
  name: string;
  path: string;
  parent: string;
  highlights: never[];
};

export type FolderSource = BaseSource & {
  id: string;
  owner: string;
  type: "FOLDER";
  name: string;
  parent: string;
  path: string;
  highlights: never[];
};

export type Source = BaseSource & (LocalPdfSource | VideoSource | FolderSource);

export type SourceDocument = RxDocument<Source>;

export type SourceCollection = RxCollection<Source>;

export type HighlightContent = {
  text?: string;
  image?: string;
};

export const ajvHighlightContent: JSONSchemaType<HighlightContent> = {
  type: "object",
  properties: {
    text: { type: "string", nullable: true },
    image: { type: "string", nullable: true },
  },
  required: [],
};

export const ajvHighlight: JSONSchemaType<HighlightViewport> = {
  type: "object",
  properties: {
    id: uuidSchema,
    color: { type: "string" },
    comment: { type: "string" },
    content: ajvHighlightContent,
    position: ajvViewportPosition,
  },
  required: ["id", "color", "comment", "comment", "position"],
};

export const ajvSourceSchema: JSONSchemaType<BaseSource> = {
  type: "object",
  properties: {
    id: uuidSchema,
    // TODO: Change to uuidSchema or root
    parent: { type: "string" },
    owner: ajvUsernameSchema,
    type: {
      type: "string",
      enum: [
        "LOCAL_PDF",
        "ONLINE_ARTICLE",
        "LOCAL_VIDEO",
        "ONLINE_VIDEO",
        "FOLDER",
      ],
    },
    path: pathSchema,
    name: titleSchema,
    highlights: {
      type: "array",
      items: { type: "object", required: [] },
    },
  },
  required: ["id", "parent", "owner", "type", "path", "name", "highlights"],
};

const highlight = {
  type: "object",
  properties: {
    id: { type: "string" },
    color: { type: "string" },
    comment: { type: "string" },
    content: {
      type: "object",
      properties: {
        text: { type: "string" },
        image: { type: "string" },
      },
    },
    position: { type: "object" },
  },
};

export const sourceSchema: RxJsonSchema<Source> = {
  version: 0,
  title: "Source schema",
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string" },
    parent: { type: "string" },
    owner: { type: "string" },
    type: { type: "string" },
    path: { type: "string" },
    name: { type: "string" },
    highlights: {
      type: "array",
      items: highlight,
    },
  },
  required: ["id", "parent", "owner", "type", "path", "name", "highlights"],
};
