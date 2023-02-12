import { JSONSchemaType } from "ajv";
import { uuidSchema } from "main/database/miscSchemas/uuidSchema";

export type Shapes = "Rectangle" | "Circle";

export const ajvShapeSchema: JSONSchemaType<Shapes> = {
  type: "string",
  enum: ["Rectangle", "Circle"],
};

export type SvgObject = {
  id: string;
  shape: Shapes;
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  cardNumber: number;
};

export const ajvSvgObject: JSONSchemaType<SvgObject> = {
  type: "object",
  properties: {
    id: uuidSchema,
    shape: ajvShapeSchema,
    xStart: { type: "number" },
    yStart: { type: "number" },
    xEnd: { type: "number" },
    yEnd: { type: "number" },
    cardNumber: { type: "number" },
  },
  required: ["id", "shape", "xStart", "yStart", "xEnd", "yEnd", "cardNumber"],
};

export type SlateImageProp = {
  svgObjects: SvgObject[];
  imageText: string;
  isCollapsed: boolean;
  src: string;
};

export type SlateImageObjOrNull = null | SlateImageProp;

export const ajvSchemaSlateImageProp: JSONSchemaType<SlateImageObjOrNull> = {
  type: "object",
  nullable: true,
  properties: {
    svgObjects: { type: "array", items: ajvSvgObject },
    imageText: { type: "string" },
    isCollapsed: { type: "boolean" },
    src: { type: "string" },
  },
  required: ["svgObjects", "imageText", "isCollapsed", "src"],
};
