import Ajv from "ajv";
import { UncheckedJSONSchemaType } from "./UncheckedJSONSchemaType";

const ajvErrors = require("ajv-errors");

export const validator = <T>(
  prop: unknown,
  schema: UncheckedJSONSchemaType<T, false>
) => {
  const ajv = new Ajv({ allErrors: true });
  ajvErrors(ajv);
  const validate = ajv.compile(schema);
  const isPropValid = validate(prop);
  if (!isPropValid) {
    if (!validate.errors) throw Error("Ajv Error");
    console.error(JSON.stringify(validate.errors));
    const mappedErrors = validate.errors.map((e) => e.message).join(".\n");
    throw Error(mappedErrors);
  }
  return prop as T;
};
