import { JSONSchemaType } from "ajv";

export const pathSchema: JSONSchemaType<string> = {
  type: "string",
  minLength: 1,
  maxLength: 2048,
};
