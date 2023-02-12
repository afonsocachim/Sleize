import React from "react";
import { cloneDeep } from "lodash";
import { Transforms } from "slate";
import {
  SlateBaseProperties,
  SlateElement,
} from "main/database/schemas/nodeSchema";
import { HMSToS } from "renderer/utils/HMStoS";
import { editorContainer } from "renderer/store/slateUtils/editorContainer";

export const resetSource = (element: SlateElement) => {
  const { editor } = editorContainer;
  const value = [...editor.children] as SlateElement[];
  const nodeIndex = value.findIndex((n) => n.id === element.id);
  const node = value[nodeIndex];
  if (!node) throw Error("no node");
  const newProps = {
    ...node,
    blockType: node.blockType === "Image" ? "Paragraph" : node.blockType,
    source: null,
  } as SlateElement;
  Transforms.removeNodes(editor, { at: [nodeIndex] });
  Transforms.insertNodes(editor, newProps, { at: [nodeIndex] });
};

export const inputChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  element: SlateElement
) => {
  const { editor } = editorContainer;
  const value = [...editor.children] as SlateElement[];
  const nodeIndex = value.findIndex((n) => n.id === element.id);
  const node = value[nodeIndex];
  if (!node) throw Error("no node");
  const { source } = node;
  if (!source) throw Error("No source");

  const newSource = cloneDeep(source);
  if (newSource.page) {
    newSource.page = parseInt(event.target.value, 10);
  } else if (newSource.time) {
    const newTime = HMSToS(event.target.value);
    newSource.time = newTime;
  } else {
    throw Error("No source time or page");
  }

  Transforms.setNodes(
    editor,
    {
      source: newSource,
    },
    { at: [nodeIndex] }
  );
};
