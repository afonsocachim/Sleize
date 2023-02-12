import { searchPdf } from "renderer/pdfViewer/reactivePdf/viewer/searchCommands";
import { isHotkey } from "renderer/hotkeys/isHotkey";
import { sourceHotkeys } from "renderer/hotkeys/hotkeyMap";
import { toggleDialog } from "./toggleDialog";

export const togglePdfSearch = (e: KeyboardEvent) => {
  if (!isHotkey(e, sourceHotkeys.searchPdf)) return;
  searchPdf.reset();
  toggleDialog("PDF_SEARCH");
};
