import React from "react";
import { colorArray } from "renderer/utils/colors";
import { lightTheme } from "renderer/styles/lightTheme";
import { getPositionCircle } from "./getPositionCircle";
import { getPositionRectangle } from "./getPositionRectangle";
import { numberToTwoDigitString } from "./numberToTwoDigitString";
import { SvgObject, CardSelected } from "./types";

export const RenderShape = ({
  obj,
  handleMouseDownObj,
  handleMouseUpObj,
  arrayPosition,
  cardSelected,
  setCardSelected,
  zoom,
}: {
  obj: SvgObject;
  handleMouseDownObj: (obj: SvgObject, e: React.MouseEvent) => void;
  handleMouseUpObj: () => void;
  arrayPosition: number;
  cardSelected: CardSelected;
  setCardSelected: (c: CardSelected) => void;
  zoom: number;
}) => {
  let x = 0;
  let y = 0;
  let w = 0;
  let h = 0;

  if (obj.shape === "Circle") {
    const coords = getPositionCircle(obj);
    x = coords.x * zoom;
    y = coords.y * zoom;
    w = coords.w * zoom;
    h = coords.h * zoom;
  }
  if (obj.shape === "Rectangle") {
    const coords = getPositionRectangle(obj);
    x = coords.x * zoom;
    y = coords.y * zoom;
    w = coords.w * zoom;
    h = coords.h * zoom;
  }

  // circle extra math
  const rx = w / 2;
  const ry = h / 2;

  // square extra math
  const selected = arrayPosition === cardSelected?.position;

  const numberString = numberToTwoDigitString(obj.cardNumber);
  const number = (obj.cardNumber - 1) % 5;
  const bgColor = colorArray[number].hex;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMouseDownObj(obj, e);
  };

  const handleMouseUpShape = () => {
    handleMouseUpObj();
    setCardSelected({ position: arrayPosition, obj });
  };

  const handleMouseUpText = () => {
    handleMouseUpObj();
    setCardSelected({ position: arrayPosition, obj });
  };

  const fill = bgColor;
  const style = {
    strokeWidth: 2,
    stroke: selected ? "black" : "lightGray",
  };

  const Text = () => (
    <text
      x={x + w / 2 - 10}
      y={y + h / 2 + 5}
      scale={1}
      fill={selected ? "black" : "gray"}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUpText}
    >
      {numberString}
    </text>
  );

  if (obj.shape === "Circle")
    return (
      <>
        <ellipse
          key={obj.id}
          cx={x + rx}
          cy={y + ry}
          rx={rx}
          ry={ry}
          fill={fill}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUpShape}
          style={style}
        />
        <Text />
      </>
    );

  if (obj.shape === "Rectangle")
    return (
      <>
        <rect
          key={obj.id}
          x={x}
          y={y}
          width={w}
          height={h}
          fill={fill}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUpShape}
          style={style}
        />
        <Text />
      </>
    );

  return null;
};
