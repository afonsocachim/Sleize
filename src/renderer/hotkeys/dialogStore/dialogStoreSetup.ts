import createStore from "zustand";
import { DialogTypes } from "./dialogTypes";

type DialogStore = {
  currentDialog: DialogTypes;
  allowDialogReset: boolean;
};

const iStore: DialogStore = {
  currentDialog: "NONE",
  allowDialogReset: true,
};

export const dialogStore = createStore<DialogStore>(() => iStore);

export const resetDialogStore = () => {
  if (dialogStore.getState().allowDialogReset) dialogStore.setState(iStore);
};
