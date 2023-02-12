import React from "react";
import { Dialog as MuiDialog, DialogContent } from "@mui/material";
import { styled } from "@mui/material/styles";

const Dialog = styled(MuiDialog)`
  .MuiDialog-paper {
    width: 80vw;
    max-width: 80vw;
    height: 80vh;
    max-height: 80vh;
  }
`;

export const FullPageDialog = ({
  open,
  setOpen,
  children,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.code === "Enter") {
          e.preventDefault();
          // handleAction();
        }
        if (e.code === "Escape") {
          e.preventDefault();
          setOpen(false);
        }
      }}
    >
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};
