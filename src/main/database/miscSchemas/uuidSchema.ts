import { JSONSchemaType } from "ajv";

export const uuidPattern =
  "^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$";

export const uuidSchema: JSONSchemaType<string> = {
  type: "string",
  pattern: uuidPattern,
};

export const uuidSchemaArray: JSONSchemaType<string[]> = {
  type: "array",
  items: uuidSchema,
};
