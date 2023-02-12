import React from "react";
import { Dialog as MuiDialog, DialogContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  dialogStore,
  resetDialogStore,
  toggleSlateSearch,
} from "renderer/hotkeys/dialogStore";
import { slateStore } from "renderer/store/slateStore";
import { SlateSearchContent } from "./SlateSearchContent";

const Dialog = styled(MuiDialog)`
  .MuiDialog-container {
    align-items: flex-start;
    justify-content: flex-start;
  }
  .MuiDialog-paper {
    margin: 8px;
    background-color: rgba(255, 255, 255, 0.95);
  }
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0);
  }
  .MuiDialogContent-root {
    padding: 8px;
  }
`;

export const SlateSearchDialog = () => {
  const isSlateSearchOpen = dialogStore(
    (s) => s.currentDialog === "SLATE_SEARCH"
  );
  React.useEffect(() => {
    slateStore.setState({
      searchString: "",
    });
    window.addEventListener("keydown", toggleSlateSearch);
    return () => {
      window.removeEventListener("keydown", toggleSlateSearch);
      slateStore.setState({
        searchString: "",
      });
    };
  }, []);
  return (
    <Dialog
      open={isSlateSearchOpen}
      onClose={() => {
        slateStore.setState({ searchString: "" });
        resetDialogStore();
      }}
      onKeyDown={(e) => {
        if (e.code === "Enter") {
          e.preventDefault();
        }
        if (e.code === "Escape") {
          e.preventDefault();
          slateStore.setState({ searchString: "" });
          resetDialogStore();
        }
      }}
    >
      <DialogContent style={{ left: 0 }}>
        <SlateSearchContent />
      </DialogContent>
    </Dialog>
  );
};
