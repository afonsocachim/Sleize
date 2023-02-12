import createStore from "zustand";
import { SlateElement } from "main/database/schemas/nodeSchema";

type ClipboardStore = {
  clipboardData: SlateElement[];
};

export const clipboardStore = createStore<ClipboardStore>(() => ({
  clipboardData: [],
}));
