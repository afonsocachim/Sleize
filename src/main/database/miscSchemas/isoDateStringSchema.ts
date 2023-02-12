import { JSONSchemaType } from "ajv";

const isoStringPattern =
  "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$";

export const isoStringSchema: JSONSchemaType<string> = {
  type: "string",
  pattern: isoStringPattern,
};
