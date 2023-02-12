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

export const SimpleDialog = ({
  open,
  setOpen,
  stringName,
  buttonText,
  action,
  string,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  stringName: string;
  buttonText: string;
  action: (s: string) => Promise<boolean>;
  string: string;
}) => {
  const [localString, setLocalString] = React.useState("");

  React.useEffect(() => {
    setLocalString(string);
  }, [string, open]);

  const handleAction = async (
    e: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const proceed = await action(localString);
    if (!proceed) return;
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
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={stringName}
          type="text"
          fullWidth
          value={localString}
          onChange={(e) => setLocalString(e.target.value)}
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
