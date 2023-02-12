import { dialogStore } from "./dialogStoreSetup";
import { DialogTypes } from "./dialogTypes";

export const toggleDialog = (string: DialogTypes) => {
  const isDialogOpen = dialogStore.getState().currentDialog === string;
  dialogStore.setState({
    currentDialog: isDialogOpen ? "NONE" : string,
  });
};
