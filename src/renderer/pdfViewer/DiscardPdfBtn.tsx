import { IconButton, Tooltip } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { sourceStore } from "renderer/store/sourceStore";

export const DiscardPdfBtn = () => {
  const handleDiscard = () => {
    sourceStore.setState({ source: undefined });
  };
  return (
    <Tooltip title="Close pdf">
      <IconButton
        size="small"
        onClick={handleDiscard}
        style={{ color: "lightgray" }}
      >
        <CancelIcon />
      </IconButton>
    </Tooltip>
  );
};
