import React from "react";
import { Dialog as MuiDialog, DialogContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PdfSearch } from "./PdfSearch";
import {
  dialogStore,
  resetDialogStore,
  togglePdfSearch,
} from "../../dialogStore";
import { searchPdf } from "../../../pdfViewer/reactivePdf/viewer/searchCommands";

const Dialog = styled(MuiDialog)`
  .MuiDialog-container {
    align-items: flex-start;
    justify-content: flex-end;
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

export const PdfSearchDialog = () => {
  const pdfSearchOpen = dialogStore((s) => s.currentDialog === "PDF_SEARCH");
  React.useEffect(() => {
    window.addEventListener("keydown", togglePdfSearch);
    return () => {
      window.removeEventListener("keydown", togglePdfSearch);
    };
  }, []);
  return (
    <Dialog
      open={pdfSearchOpen}
      onClose={() => {
        searchPdf.reset();
        resetDialogStore();
      }}
      onKeyDown={(e) => {
        if (e.code === "Enter") {
          e.preventDefault();
        }
        if (e.code === "Escape") {
          e.preventDefault();
          resetDialogStore();
        }
      }}
    >
      <DialogContent style={{ left: 0 }}>
        <PdfSearch />
      </DialogContent>
    </Dialog>
  );
};
