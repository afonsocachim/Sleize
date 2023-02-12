import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteNoteAndDescendants } from "renderer/store/noteUtils/deleteNoteAndDescendants";
import { ConfirmDialog } from "renderer/components/dialogs/ConfirmDialog";
import { noteStore } from "renderer/store/noteStore";

export const DeleteNoteBtn = () => {
  const handleDiscard = () => {
    const { note } = noteStore.getState();
    if (!note) throw Error("no note");
    deleteNoteAndDescendants(note);
  };

  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Tooltip title="Delete note">
      <IconButton
        onClick={() => {
          setOpen(true);
        }}
      >
        <DeleteIcon />
        <ConfirmDialog
          open={open}
          setOpen={setOpen}
          string="Delete note and all its descendants?"
          action={handleDiscard}
          buttonText="Delete"
        />
      </IconButton>
    </Tooltip>
  );
};
