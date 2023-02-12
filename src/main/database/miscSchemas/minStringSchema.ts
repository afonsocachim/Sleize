import { JSONSchemaType } from "ajv";

export const minStringSchema: JSONSchemaType<string> = {
  type: "string",
  minLength: 1,
  errorMessage: "Field cannot be empty",
};
