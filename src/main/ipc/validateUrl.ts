import { urlSchema } from "main/database/miscSchemas/urlSchema";
import { validator } from "./validator";

export const validateUrl = (passedUrl: unknown) => {
  const urlString = validator<string>(passedUrl, urlSchema);

  let url;

  try {
    url = new URL(urlString);
  } catch (_) {
    throw Error("Invalid Url");
  }

  const validProtocol = url.protocol === "http:" || url.protocol === "https:";
  if (!validProtocol) throw Error("Invalid Url");

  return urlString;
};
