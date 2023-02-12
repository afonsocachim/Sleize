import { JSONSchemaType } from "ajv";
import { RxDocument, RxJsonSchema, RxCollection } from "rxdb";
import { LibraryState, ajvLibraryHash } from "./librarySchema";

export type User = {
  username: string;
  password: string;
  library: LibraryState;
};

export const ajvUsernameSchema: JSONSchemaType<string> = {
  type: "string",
  minLength: 2,
  maxLength: 32,
  errorMessage: "Username must be between 2 and 32 characters",
};

export const ajvPasswordSchema: JSONSchemaType<string> = {
  type: "string",
  minLength: 4,
  maxLength: 128,
  errorMessage: "Password must be between 4 and 128 characters",
};

export type UserDocument = RxDocument<User>;

export type UserCollection = RxCollection<User>;

export const ajvUserSchema: JSONSchemaType<User> = {
  type: "object",
  properties: {
    username: ajvUsernameSchema,
    password: ajvPasswordSchema,
    library: ajvLibraryHash,
  },
  required: ["username", "password", "library"],
};

export const rxdbUserSchema: RxJsonSchema<User> = {
  version: 0,
  title: "User schema",
  keyCompression: true,
  primaryKey: "username",
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" },
    library: {
      type: "object",
    },
  },
  required: ["username", "password", "library"],
};
