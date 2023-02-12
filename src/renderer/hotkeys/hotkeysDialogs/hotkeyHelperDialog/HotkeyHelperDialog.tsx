import React from "react";
import {
  Dialog as MuiDialog,
  DialogContent as MuiDialogContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  dialogStore,
  resetDialogStore,
  toggleHotkeyHelper,
} from "../../dialogStore";
import { HotkeyHelperContent } from "./HotkeyHelperContent";

const Dialog = styled(MuiDialog)`
  .MuiDialog-paper {
    width: 90vw;
    max-width: 90vw;
    height: 90vh;
    max-height: 90vh;
  }
  ul {
    list-style-type: circle;
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }
`;

const DialogContent = styled(MuiDialogContent)`
  overflow: scroll;
  ::-webkit-scrollbar {
    width: 14px;
  }

  ::-webkit-scrollbar-thumb {
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 9999px;
    background-color: #aaaaaa;
  }
  ::-webkit-scrollbar-corner {
    background: rgba(0, 0, 0, 0);
  }
`;

export const HotkeyHelperDialog = () => {
  const isHotkeyDialogOpen = dialogStore(
    (s) => s.currentDialog === "HOTKEY_HELPER"
  );

  React.useEffect(() => {
    window.addEventListener("keydown", toggleHotkeyHelper);
    return () => {
      window.removeEventListener("keydown", toggleHotkeyHelper);
    };
  }, []);

  return (
    <Dialog
      open={isHotkeyDialogOpen}
      onClose={() => resetDialogStore()}
      onKeyDown={(e) => {
        if (e.code === "Enter") {
          e.preventDefault();
          // handleAction();
        }
        if (e.code === "Escape") {
          e.preventDefault();
          resetDialogStore();
        }
      }}
    >
      <DialogContent>
        <HotkeyHelperContent />
      </DialogContent>
    </Dialog>
  );
};
