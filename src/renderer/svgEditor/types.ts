export type Tools = Shapes | "Select" | undefined;

export type Shapes = "Rectangle" | "Circle";

export type SvgObject = {
  id: string;
  shape: Shapes;
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  cardNumber: number;
};

export type ShapeMoveId = string | undefined;
export type DragStart = { x: number; y: number } | undefined;
export type CardSelected = undefined | { obj: SvgObject; position: number };
