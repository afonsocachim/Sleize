import React from "react";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/system";
import { dialogStore, resetDialogStore } from "renderer/hotkeys/dialogStore";
import { insertOnlineVideoInvoker } from "renderer/ipc/sourceInvokers";

const StyDialogContent = styled(DialogContent)(() => ({
  minWidth: "400px",
}));

export const OnlineVideoDialog = () => {
  const open = dialogStore((s) => s.currentDialog === "ADD_ONLINE_VIDEO");
  const [title, setTitle] = React.useState<string>("");
  const [url, setUrl] = React.useState<string>("");

  const handleAction = async (
    e: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await insertOnlineVideoInvoker(url, title);
    if (result.error) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    resetDialogStore();
    setTitle("");
    setUrl("");
  };

  const onClose = (
    e: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    resetDialogStore();
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
          resetDialogStore();
          setTitle("");
        }
      }}
    >
      <StyDialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Video title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          id="name"
          label="Url"
          type="email"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </StyDialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAction} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
