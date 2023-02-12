import { getNotesInvoker } from "renderer/ipc/notesInvoker";
import { drawerStore } from "../drawerStore";
import { noteStore } from "../noteStore";
import { reviewStore } from "../reviewStore";

export const exitReviewScreen = async () => {
  reviewStore.setState({ reviewMode: false });
  drawerStore.setState({ isDrawerOpen: true });
};
