import createStore from "zustand";
import { Source } from "main/database/schemas/sourceSchema";
import { Note } from "main/database/schemas/noteSchema";
import { SlateElement } from "main/database/schemas/nodeSchema";
import { resetPdfStore } from "renderer/pdfViewer/pdfStore";
import { resetVideoStore } from "../videoStore";

type SourceStore = {
  source: Source | undefined;
  nodeToChangeSource: {
    note: Note;
    element: SlateElement;
  } | null;
};

const iStore = {
  source: undefined,
  nodeToChangeSource: null,
};

const sourceStore = createStore<SourceStore>(() => iStore);

const chooseSource = async (source: Source) => {
  sourceStore.setState({ source });
  resetPdfStore();
  resetVideoStore();
};

const resetSourceStore = () => sourceStore.setState(iStore);

export { chooseSource, sourceStore, resetSourceStore };
