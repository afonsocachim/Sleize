import { IconButton, Tooltip } from "@mui/material";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import { dialogStore } from "../../../hotkeys/dialogStore";

export const ShowSourcesBtn = () => {
  return (
    <Tooltip title="Show sources">
      <IconButton
        size="small"
        onClick={() => {
          dialogStore.setState({ currentDialog: "SOURCE_TREE" });
        }}
      >
        <ImportContactsIcon />
      </IconButton>
    </Tooltip>
  );
};
