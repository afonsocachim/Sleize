import React from "react";
import { Grid } from "@mui/material";
import { drawerStore, drawerWidth } from "renderer/store/drawerStore";
import { reviewStore } from "renderer/store/reviewStore";
import { SimpleShape } from "./SimpleShape";
import { SvgObject } from "./types";

const initialWidthAndHeight = {
  width: 0,
  height: 0,
};

const maxHeight = window.innerHeight - 40 - 57.5 - 20 - 100;

export const ImageOcclusion = ({
  svgSrc,
  svgObjects,
}: {
  svgSrc: string;
  svgObjects: SvgObject[];
}) => {
  // store
  const isDrawerOpen = drawerStore((s) => s.isDrawerOpen);
  const currentCard = reviewStore((s) => s.currentCard);
  const showAnswer = reviewStore((s) => s.showAnswer);
  if (!currentCard) throw Error("No card");
  // ref
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  // state
  const [widthAndHeight, setWidthAndHeight] = React.useState(
    initialWidthAndHeight
  );

  const [zoom, setZoom] = React.useState(1);

  const mainContainerWidth = isDrawerOpen
    ? window.innerWidth - drawerWidth - 40
    : window.innerWidth - 40;

  React.useEffect(() => {
    const i = new Image();

    i.onload = () => {
      const ratio = i.height / i.width;
      const width = i.width > mainContainerWidth ? mainContainerWidth : i.width;
      const finalHeight = width * ratio > maxHeight ? maxHeight : width * ratio;
      const finalWidth = finalHeight / ratio;
      const newZoom = finalWidth / i.width;
      setWidthAndHeight({ width: i.width, height: i.height });
      setZoom(newZoom);
    };

    i.src = svgSrc;
  }, [mainContainerWidth, svgSrc]);

  React.useEffect(() => {
    const { width, height } = widthAndHeight;
    if (!width || !height) return;
    const prevWidth = width * zoom;
    const newWidth =
      prevWidth > mainContainerWidth ? mainContainerWidth : prevWidth;
    const newHeight = (newWidth * height) / width;
    const finalHeight = newHeight > maxHeight ? maxHeight : newHeight;
    const newZoom = finalHeight / height;
    setZoom(newZoom);
  }, [isDrawerOpen, mainContainerWidth, widthAndHeight, zoom]);

  return (
    <Grid
      contentEditable={false}
      style={{
        height: maxHeight,
        userSelect: "none",
      }}
      container
      direction="row"
      alignItems="stretch"
    >
      <div style={{ width: 20 }} />
      <Grid
        item
        justifyContent="center"
        alignItems="center"
        container
        style={{
          height: maxHeight,
          width: mainContainerWidth,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative" }}>
          <svg
            ref={svgRef}
            style={{
              height: widthAndHeight.height * zoom,
              width: widthAndHeight.width * zoom,
              position: "absolute",
              left: 0,
              top: 0,
            }}
          >
            {!showAnswer &&
              svgObjects
                .filter((s) => s.cardNumber === currentCard.clozeNumber)
                .map((o) => <SimpleShape obj={o} zoom={zoom} />)}
          </svg>
          <img
            ref={imageRef}
            src={svgSrc}
            alt=""
            style={{
              height: widthAndHeight.height * zoom,
              width: widthAndHeight.width * zoom,
              border: "1px solid gray",
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
};
