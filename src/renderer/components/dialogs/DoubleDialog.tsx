import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/system";

const StyDialogContent = styled(DialogContent)(() => ({
  minWidth: "400px",
}));

export const DoubleDialog = ({
  open,
  setOpen,
  stringName1,
  stringName2,
  buttonText,
  action,
  string1,
  setString1,
  string2,
  setString2,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  stringName1: string;
  stringName2: string;
  buttonText: string;
  action: () => void;
  string1: string;
  setString1: React.Dispatch<React.SetStateAction<string>>;
  string2: string;
  setString2: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleAction = (
    e: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    action();
    setOpen(false);
    setString1("");
    setString2("");
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
          setString1("");
        }
      }}
    >
      <StyDialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={stringName1}
          type="email"
          fullWidth
          value={string1}
          onChange={(e) => setString1(e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={stringName2}
          type="email"
          fullWidth
          value={string2}
          onChange={(e) => setString2(e.target.value)}
        />
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
