import { viewerObject } from "./viewerObject";

const previous = (query: string) => {
  if (!viewerObject.viewer) return;
  viewerObject.viewer?.findController.executeCommand("findagain", {
    query,
    phraseSearch: true,
    caseSensitive: false,
    entireWord: false,
    highlightAll: true,
    findPrevious: true,
  });
};

const reset = () => {
  const { viewer } = viewerObject;
  if (!viewer) return;
  viewer.findController.executeCommand("", {
    query: "",
    phraseSearch: false,
    caseSensitive: true,
    entireWord: false,
    highlightAll: false,
    findPrevious: false,
  });
};

const next = (query: string) => {
  const { viewer } = viewerObject;
  if (!viewer) return;
  viewer.findController.executeCommand("findagain", {
    query,
    phraseSearch: true,
    caseSensitive: false,
    entireWord: false,
    highlightAll: true,
    findPrevious: false,
  });
};

export const searchPdf = {
  previous,
  next,
  reset,
};
