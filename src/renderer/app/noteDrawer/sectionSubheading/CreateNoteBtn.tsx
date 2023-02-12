import React from "react";
import { v4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";
import { SimpleDialog } from "renderer/components/dialogs/SimpleDialog";
import { IconButton, Tooltip } from "@mui/material";
import { sectionStore } from "renderer/store/sectionStore";
import { insertNoteInvoker } from "renderer/ipc/notesInvoker";

export const CreateNoteBtn = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const stringName = "Title";
  const buttonText = "Submit";
  const action = async (s: string) => {
    const result = await insertNoteInvoker(s);
    if (result.error) return false;
    return true;
  };

  const section = sectionStore((s) => s.section);

  if (!section) return null;

  return (
    <Tooltip title="Add note">
      <IconButton
        size="small"
        style={{ padding: 0 }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
        <SimpleDialog
          open={open}
          setOpen={setOpen}
          stringName={stringName}
          buttonText={buttonText}
          action={action}
          string={""}
        />
      </IconButton>
    </Tooltip>
  );
};
