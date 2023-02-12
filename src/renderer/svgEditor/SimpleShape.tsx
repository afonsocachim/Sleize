import { getPositionCircle } from "./getPositionCircle";
import { getPositionRectangle } from "./getPositionRectangle";
import { numberToTwoDigitString } from "./numberToTwoDigitString";
import { SvgObject } from "./types";

export const SimpleShape = ({
  obj,
  zoom,
}: {
  obj: SvgObject;
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

  const numberString = numberToTwoDigitString(obj.cardNumber);

  const fill = "red";
  const style = {
    strokeWidth: 1,
    stroke: "black",
  };

  const Text = () => (
    <text x={x + w / 2 - 10} y={y + h / 2 + 5} scale={1}>
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
          style={style}
        />
        <Text />
      </>
    );

  return null;
};
