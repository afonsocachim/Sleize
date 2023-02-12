import React from "react";
import { IconButton, ToggleButton, Tooltip } from "@mui/material";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import { sourceStore } from "renderer/store/sourceStore";
import { noteStore } from "renderer/store/noteStore";

export const FocusModeBtn = () => {
  const source = sourceStore((s) => s.source);
  const focusMode = noteStore((s) => s.focusMode);

  React.useEffect(() => {
    if (!source) noteStore.setState({ focusMode: false });
  }, [source, focusMode]);

  return (
    <Tooltip title="Focus Mode">
      <ToggleButton
        size="small"
        value="check"
        selected={Boolean(focusMode)}
        onClick={() => {
          if (source) noteStore.setState({ focusMode: !focusMode });
          if (!source) noteStore.setState({ focusMode: false });
        }}
        style={{
          padding: 4,
          margin: 0,
        }}
      >
        <CenterFocusStrongIcon />
      </ToggleButton>
    </Tooltip>
  );
};
