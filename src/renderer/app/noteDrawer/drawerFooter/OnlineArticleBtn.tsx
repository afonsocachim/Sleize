import React from "react";
import { Tooltip, IconButton } from "@mui/material";
import { IconFromSourceType } from "renderer/components/IconFromExtension";
import { dialogStore } from "renderer/hotkeys/dialogStore";

export const OnlineArticleBtn = () => {
  return (
    <Tooltip title="Web article">
      <IconButton
        onClick={() => dialogStore.setState({ currentDialog: "ADD_ARTICLE" })}
      >
        <IconFromSourceType ext="ONLINE_ARTICLE" />
      </IconButton>
    </Tooltip>
  );
};
