/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Grid, Typography } from "@mui/material";
import { SlateAttributes } from "main/database/schemas/nodeSchema";

export const QuestionRenderer = ({
  children,
  attributes,
}: {
  children: React.ReactNode;
  attributes: SlateAttributes;
}) => {
  return (
    <Grid container alignItems="center" {...attributes}>
      <Typography
        style={{
          borderBottom: `1px solid #bdbdbd`,
        }}
      >
        {children}
      </Typography>
    </Grid>
  );
};
