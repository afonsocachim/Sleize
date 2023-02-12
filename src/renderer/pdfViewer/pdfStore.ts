import createStore from "zustand";
// @ts-ignore
import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import {
  ViewportPosition,
  HighlightViewport,
  HighlightContent,
} from "../../main/database/schemas/highlightSchema";
import { emptyId } from "./reactivePdf/utils/emptyId";

type Tip = {
  highlight: HighlightViewport;
  callback: (highlight: HighlightViewport) => JSX.Element;
} | null;

type NewHighlightPositionAndContent = {
  content: HighlightContent;
  position: ViewportPosition;
} | null;

type PdfStore = {
  pdfDocument: PDFDocumentProxy | undefined;
  setPdfDocument: (pdfDocument: PDFDocumentProxy | undefined) => void;
  highlights: HighlightViewport[];
  idScrolledTo: string;
  setIdScrolledTo: (idScrolledTo: string) => void;
  isHighlightAreaInProgress: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  tip: Tip;
  setTip: (tip: Tip) => void;
  tipPosition: ViewportPosition | null;
  setTipPosition: (tipPosition: ViewportPosition | null) => void;
  newHighlightPositionAndContent: NewHighlightPositionAndContent;
  hideTipAndSelection: () => void;
  showTip: (highlight: HighlightViewport) => void;
};

export const pdfStore = createStore<PdfStore>((set, get) => ({
  pdfDocument: undefined,
  highlights: [],
  idScrolledTo: emptyId,
  isHighlightAreaInProgress: false,
  isCollapsed: false,
  tip: null,
  tipPosition: null,
  newHighlightPositionAndContent: null,

  setPdfDocument: (pdfDocument) => set({ pdfDocument }),

  setIdScrolledTo: (idScrolledTo) => set({ idScrolledTo }),

  setIsCollapsed: (isCollapsed) => set({ isCollapsed }),

  setTip: (tip) => set({ tip }),

  setTipPosition: (tipPosition) => set({ tipPosition }),

  hideTipAndSelection: () => {
    set({
      tipPosition: null,
      newHighlightPositionAndContent: null,
      tip: null,
    });
  },

  showTip: (highlight) => {
    const { isCollapsed, setTipPosition, isHighlightAreaInProgress } = get();

    const highlightInProgress = !isCollapsed;

    if (highlightInProgress || isHighlightAreaInProgress) {
      return;
    }

    setTipPosition(highlight.position);
  },
}));

export const resetPdfStore = () =>
  pdfStore.setState({
    pdfDocument: undefined,
    highlights: [],
    idScrolledTo: emptyId,
    isHighlightAreaInProgress: false,
    isCollapsed: false,
    tip: null,
    tipPosition: null,
    newHighlightPositionAndContent: null,
  });
