import createStore from "zustand";
import { debounce } from "lodash";
import { toolbarScaleValue } from "./reactivePdf/viewer/toolbarScaleValue";
import { changePageNumber } from "./reactivePdf/viewer/changePageNumber";
import {
  pdfPalette,
  PdfViewerPalette,
  articlePalette,
} from "./pdfViewerPalette";

let allowNextScroll = true;

type PdfToolbarStore = {
  CurrentPageNumber: number;
  setCurrentPageNumber: (CurrentPageNumber: number, string: string) => void;
  CurrentPageScalePercent: number;
  setCurrentPageScalePercent: (CurrentPageScalePercent: number) => void;
  MaxPageNumber: number;
  setMaxPageNumber: (MaxPageNumber: number) => void;
  FitToPagePercent: number;
  setFitToPagePercent: (FitToPagePercent: number) => void;
  containerWidth: number;
  pdfViewerPalette: PdfViewerPalette;
};

export const pdfToolbarStore = createStore<PdfToolbarStore>((set, get) => ({
  pdfViewerPalette: pdfPalette,
  CurrentPageNumber: 1,
  setCurrentPageNumber: (CurrentPageNumber, string) => {
    if (string === "arrow") {
      allowNextScroll = false;
      let pageToSet;
      const { MaxPageNumber } = get();
      if (CurrentPageNumber > MaxPageNumber) {
        pageToSet = MaxPageNumber;
        set({ CurrentPageNumber: MaxPageNumber });
      } else if (CurrentPageNumber < 1) {
        pageToSet = 1;
        set({ CurrentPageNumber: 1 });
      } else {
        pageToSet = CurrentPageNumber;
        set({ CurrentPageNumber });
      }
      changePageNumber(pageToSet);
    } else if (string === "scrolled") {
      if (allowNextScroll) {
        set({ CurrentPageNumber });
      } else {
        allowNextScroll = true;
      }
    } else {
      // eslint-disable-next-line no-console
      console.error({ CurrentPageNumber, string });
    }
  },
  CurrentPageScalePercent: 100,
  setCurrentPageScalePercent: (CurrentPageScalePercent) => {
    set({ CurrentPageScalePercent });

    // toolbarScaleValue(CurrentPageScalePercent);
  },
  MaxPageNumber: 1,
  setMaxPageNumber: (MaxPageNumber) => set({ MaxPageNumber }),
  FitToPagePercent: 100,
  setFitToPagePercent: (FitToPagePercent) => set({ FitToPagePercent }),
  containerWidth: 500,
}));

export const originalUpdateScaleValue = () => {
  const { CurrentPageScalePercent } = pdfToolbarStore.getState();
  toolbarScaleValue(CurrentPageScalePercent);
};
export const updateScaleValue = debounce(originalUpdateScaleValue, 500);

export const setPaletteToPdf = () =>
  pdfToolbarStore.setState({ pdfViewerPalette: pdfPalette });
export const setPaletteToArticle = () =>
  pdfToolbarStore.setState({ pdfViewerPalette: articlePalette });
