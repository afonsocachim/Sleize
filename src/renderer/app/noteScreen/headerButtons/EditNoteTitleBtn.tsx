import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import { noteStore } from "renderer/store/noteStore";
import { SimpleDialog } from "renderer/components/dialogs/SimpleDialog";
import { updateNoteInvoker } from "renderer/ipc/notesInvoker";

export const EditNoteTitleBtn = ({ text }: { text: string }) => {
  const note = noteStore((s) => s.note);
  if (!note) throw Error("No note at EditIcon");

  const [open, setOpen] = React.useState<boolean>(false);

  const stringName = "Title";
  const buttonText = "Submit";

  const action = async (s: string) => {
    const newNote = { ...note, text: s };
    const result = await updateNoteInvoker(newNote);
    if (result.error) return false;
    noteStore.setState({ note: result.data });
    return true;
  };

  return (
    <Tooltip title="Edit title">
      <IconButton onClick={() => setOpen(true)}>
        <Edit />
        <SimpleDialog
          open={open}
          setOpen={setOpen}
          stringName={stringName}
          buttonText={buttonText}
          action={action}
          string={note.text}
        />
      </IconButton>
    </Tooltip>
  );
};
