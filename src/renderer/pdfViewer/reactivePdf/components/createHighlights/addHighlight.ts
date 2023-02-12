import { v4 } from "uuid";
import { colorArray } from "renderer/utils/colors";
import { pdfStore } from "renderer/pdfViewer/pdfStore";
import { sourceStore } from "renderer/store/sourceStore";
import { HighlightViewport } from "main/database/schemas/highlightSchema";
import { SlateParagraph, SlateImage } from "main/database/schemas/nodeSchema";
import { pdfToolbarStore } from "renderer/pdfViewer/pdfToolbarStore";
import {
  newHighlightImageNode,
  newHighlightParagraphNode,
} from "renderer/store/slateUtils/generators";
import { editorContainer } from "renderer/store/slateUtils/editorContainer";
import { updateAndSetSourceInvoker } from "renderer/ipc/sourceInvokers";
import { scaleHighlightToPage } from "../renderHighlights/scaleHighlight";

export const addHighlight = async (
  color: string,
  commentText: string,
  pinSelected: boolean
) => {
  const { CurrentPageNumber: pageNumber } = pdfToolbarStore.getState();
  const { editor } = editorContainer;
  const { newHighlightPositionAndContent } = pdfStore.getState();
  if (!newHighlightPositionAndContent) throw Error("No tipChildren");
  const { content, position } = newHighlightPositionAndContent;
  const highlight: HighlightViewport = {
    id: v4(),
    color: color || colorArray[0].hex,
    comment: commentText,
    content,
    position,
  };

  const ratio = 100 / pdfToolbarStore.getState().CurrentPageScalePercent;
  const newHighlight = scaleHighlightToPage(highlight, ratio);

  const { source } = sourceStore.getState();
  if (!source) throw Error("No pdf");
  const newSource = {
    ...source,
    highlights: [...source.highlights, newHighlight],
  };
  const { error } = await updateAndSetSourceInvoker(newSource);
  if (error) return;
  pdfStore.getState().hideTipAndSelection();
  if (!pinSelected) return;
  const { image, text } = content;
  let newNode: undefined | SlateImage | SlateParagraph;
  if (image) {
    const imageNode = newHighlightImageNode(source, pageNumber, image, color);

    newNode = imageNode;
  } else if (text) {
    const pNode = newHighlightParagraphNode(source, pageNumber, text, color);

    newNode = pNode;
  }
  if (!newNode) return;
  editor.insertNode(newNode);
};
