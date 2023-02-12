import create from "zustand";
import { HighlightViewport } from "main/database/schemas/highlightSchema";

type RenderStore = {
  highlight: HighlightViewport | undefined;
  allowChange: boolean;
  highlightBeingCreated: boolean;
};

export const renderStore = create<RenderStore>(() => ({
  highlight: undefined,
  allowChange: true,
  highlightBeingCreated: false,
}));
