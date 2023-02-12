import React from "react";
import { Dialog as MuiDialog, DialogContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  dialogStore,
  resetDialogStore,
  toggleSourceTree,
} from "../../dialogStore";
import { SourceTreeContent } from "./SourceTreeContent";

const Dialog = styled(MuiDialog)`
  .MuiDialog-paper {
    width: 80vw;
    max-width: 80vw;
    height: 80vh;
    max-height: 80vh;
  }
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0);
  }
`;

export const SourceTreeDialog = () => {
  const isSourceTreeOpen = dialogStore(
    (s) => s.currentDialog === "SOURCE_TREE"
  );

  React.useEffect(() => {
    window.addEventListener("keydown", toggleSourceTree);
    return () => {
      window.removeEventListener("keydown", toggleSourceTree);
    };
  }, []);

  return (
    <Dialog
      open={isSourceTreeOpen}
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
        <SourceTreeContent />
      </DialogContent>
    </Dialog>
  );
};
