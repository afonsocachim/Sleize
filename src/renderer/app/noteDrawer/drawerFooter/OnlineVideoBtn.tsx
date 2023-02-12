import { Tooltip, IconButton } from "@mui/material";
import React from "react";
import { IconFromSourceType } from "renderer/components/IconFromExtension";
import { dialogStore } from "renderer/hotkeys/dialogStore";

export const OnlineVideoBtn = () => {
  return (
    <Tooltip title="Web video">
      <IconButton
        onClick={() =>
          dialogStore.setState({ currentDialog: "ADD_ONLINE_VIDEO" })
        }
      >
        <IconFromSourceType ext="ONLINE_VIDEO" />
      </IconButton>
    </Tooltip>
  );
};
