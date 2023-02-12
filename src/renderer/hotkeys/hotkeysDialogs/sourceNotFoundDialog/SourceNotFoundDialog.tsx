import { Dialog as MuiDialog, DialogContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import { sourceStore } from "renderer/store/sourceStore";
import { dialogStore, resetDialogStore } from "../../dialogStore";
import { SourceNotFoundContent } from "./SourceNotFoundContent";

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

export const SourceNotFoundDialog = () => {
  const open = dialogStore((s) => s.currentDialog === "SOURCE_NOT_FOUND");
  const nodeToChangeSource = sourceStore((s) => s.nodeToChangeSource);

  if (!open) return null;
  if (!nodeToChangeSource) return null;

  return (
    <Dialog
      open
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
        <SourceNotFoundContent />
      </DialogContent>
    </Dialog>
  );
};
