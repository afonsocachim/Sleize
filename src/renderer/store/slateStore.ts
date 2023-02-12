import createStore from "zustand";
import { SlateElement } from "main/database/schemas/nodeSchema";
import { BaseSelection } from "slate";

export type HeadingToToggle = { id: string; toggle: boolean };
export type SetHeadingToToggle = (HeadingToToggle: HeadingToToggle) => void;

export type SlateStore = {
  popperClosed: boolean;
  HeadingToToggle: HeadingToToggle;
  value: SlateElement[] | null;
  mainWrapperRatio: number;
  containerTop: number;
  containerOffsetLeft: undefined | number;
  findsArray: Element[];
  searchString: string;
  slateSelection: BaseSelection | null;
};

const initialSlateStore: SlateStore = {
  popperClosed: true,
  HeadingToToggle: { id: "", toggle: true },
  value: null,
  mainWrapperRatio: 1 / 2,
  containerTop: 64,
  containerOffsetLeft: undefined,
  findsArray: [],
  searchString: "",
  slateSelection: null,
};

export const slateStore = createStore<SlateStore>(() => initialSlateStore);

export const resetSlateStore = () => slateStore.setState(initialSlateStore);
