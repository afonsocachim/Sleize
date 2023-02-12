import { JSONSchemaType } from "ajv";

export const urlSchema: JSONSchemaType<string> = {
  type: "string",
  minLength: 1,
  errorMessage: "Url cannot be empty",
};
