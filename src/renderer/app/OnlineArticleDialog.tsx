import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/system";
import { dialogStore, resetDialogStore } from "renderer/hotkeys/dialogStore";
import { userStore } from "renderer/store/userStore";
import { insertArticleInvoker } from "renderer/ipc/sourceInvokers";
import { toast } from "react-toastify";

const StyDialogContent = styled(DialogContent)(() => ({
  minWidth: "400px",
}));

export const OnlineArticleDialog = () => {
  const open = dialogStore((s) => s.currentDialog === "ADD_ARTICLE");
  const [title, setTitle] = React.useState<string>("");
  const [url, setUrl] = React.useState<string>("");

  const handleAction = async (
    e: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const { user } = userStore.getState();
    if (!user) throw Error("no user");
    const id = toast.loading("Getting article");
    const result = await insertArticleInvoker(url, title);
    if (result.error) {
      toast.update(id, {
        render: result.message,
        type: "error",
        isLoading: false,
        autoClose: 0,
      });
      return;
    }
    toast.update(id, {
      render: result.message,
      type: "success",
      isLoading: false,
      autoClose: 0,
    });
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
          label="Article title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Url"
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
