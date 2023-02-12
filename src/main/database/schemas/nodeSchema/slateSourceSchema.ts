import { JSONSchemaType } from "ajv";
import { uuidSchema } from "main/database/miscSchemas/uuidSchema";

export type BaseSlateSource = {
  type: "LOCAL_VIDEO" | "ONLINE_VIDEO" | "LOCAL_PDF" | "ONLINE_ARTICLE";
  id: string;
  time: number | null;
  page: number | null;
  color: string | null;
};

export type SlateVideoSource = BaseSlateSource & {
  type: "LOCAL_VIDEO" | "ONLINE_VIDEO";
  id: string;
  time: number;
  page: null;
  color: null;
};

export type SlatePdfSource = BaseSlateSource & {
  type: "LOCAL_PDF" | "ONLINE_ARTICLE";
  id: string;
  time: null;
  page: number;
  color: string;
};

export type SlateSource = BaseSlateSource | null;

export const ajvSlateSource: JSONSchemaType<SlateSource> = {
  type: "object",
  nullable: true,
  properties: {
    type: {
      type: "string",
      enum: ["LOCAL_VIDEO", "ONLINE_VIDEO", "LOCAL_PDF", "ONLINE_ARTICLE"],
    },
    id: uuidSchema,
    time: { type: "number", nullable: true },
    page: { type: "number", nullable: true },
    color: { type: "string", nullable: true },
  },
  required: ["type", "id"],
};
