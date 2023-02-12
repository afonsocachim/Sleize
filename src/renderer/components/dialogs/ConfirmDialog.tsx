import React from "react";
import { styled } from "@mui/system";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";

const StyDialogContent = styled(DialogContent)(() => ({
  minWidth: "400px",
}));

export const ConfirmDialog = ({
  open,
  setOpen,
  buttonText,
  action,
  string,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  buttonText: string;
  action: () => void;
  string: string;
}) => {
  const handleAction = (
    e: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    action();
    setOpen(false);
  };

  const onClose = (
    e: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.code === "Enter") {
          handleAction(e);
        }
        if (e.code === "Escape") {
          e.preventDefault();
          setOpen(false);
        }
      }}
    >
      <StyDialogContent>
        <Typography>{string}</Typography>
      </StyDialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAction} color="primary">
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
