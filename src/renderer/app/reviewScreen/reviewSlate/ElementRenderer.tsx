/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import {
  SlateAttributes,
  SlateQuestion,
  SlateImage,
} from "main/database/schemas/nodeSchema";
import { ImageOcclusion } from "renderer/svgEditor/ImageOcclusion";
import { Grid, Typography } from "@mui/material";

export const ElementRenderer = ({
  attributes,
  children,
  element,
}: {
  attributes: SlateAttributes;
  children: React.ReactNode;
  element: SlateQuestion | SlateImage;
}) => {
  switch (element.blockType) {
    // BLOCKS
    case "Image":
      return (
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          style={{ width: "100%" }}
          {...attributes}
        >
          <Typography style={{ textAlign: "center" }}>{children}</Typography>
          <ImageOcclusion
            svgSrc={element.image.src}
            svgObjects={element.image.svgObjects}
          />
        </Grid>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};
