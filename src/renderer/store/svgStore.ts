import { SlateImage } from "main/database/schemas/nodeSchema";
import { SvgObject } from "renderer/svgEditor/types";
import createStore from "zustand";

type SvgStore = {
  svgSrc: string | undefined;
  initialSvgObjects: SvgObject[];
  slateImage: SlateImage | undefined;
};

const iStore: SvgStore = {
  svgSrc: undefined,
  initialSvgObjects: [],
  slateImage: undefined,
};

export const svgStore = createStore<SvgStore>(() => iStore);

export const resetSvgStore = () => svgStore.setState(iStore);
