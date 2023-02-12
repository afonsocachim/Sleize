/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Grid, Typography } from "@mui/material";
import {
  SlateElement,
  SlateAttributes,
  SlateQuestion,
} from "main/database/schemas/nodeSchema";

export const QuestionRenderer = ({
  element,
  children,
  attributes,
}: {
  element: SlateQuestion;
  children: React.ReactChild;
  attributes: SlateAttributes;
}) => {
  return (
    <Grid container alignItems="center" {...attributes}>
      <Typography>{children}</Typography>
    </Grid>
  );
};
