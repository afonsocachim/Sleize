import { JSONSchemaType } from "ajv";

const generalError = "Title cannot be empty";
const maxLengthError = "Title cannot greater than 100 characters";

export const titleSchema: JSONSchemaType<string> = {
  type: "string",
  minLength: 1,
  maxLength: 100,
  errorMessage: {
    maxLength: maxLengthError,
    _: generalError,
  },
};
