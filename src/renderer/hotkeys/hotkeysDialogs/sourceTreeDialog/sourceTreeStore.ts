import { Source } from "main/database/schemas/sourceSchema";
import createStore from "zustand";
import { SourceModel } from "./types";

export type Directory = [{ name: "Sources"; id: "root" }, ...Source[]];

const initialDirectory: SourceModel = {
  id: "root",
  parent: "root",
  text: "Root",
  droppable: true,
  data: {
    doc: undefined,
  },
};

type SourceTreeStore = {
  directory: SourceModel[];
  sourceHash: { [sourceId: string]: Source };
};

const iStore: SourceTreeStore = {
  directory: [initialDirectory],
  sourceHash: {},
};

export const sourceTreeStore = createStore<SourceTreeStore>(() => iStore);

export const resetSourceTreeStore = () => sourceTreeStore.setState(iStore);
