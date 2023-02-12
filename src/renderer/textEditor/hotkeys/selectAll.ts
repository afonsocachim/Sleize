import React from "react";
import { Selection, Transforms } from "slate";
import { SlateEditor, SlateElement } from "main/database/schemas/nodeSchema";
import { isHotkey } from "renderer/hotkeys/isHotkey";
import { getLastLeafAndOffsetOfNode } from "../utils/getLastLeafAndOffsetOfNode";

export const selectAll = async (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  const e = event as unknown as KeyboardEvent;
  if (!isHotkey(e, { ctrl: true, key: "A" })) return;
  const value = [...editor.children] as SlateElement[];
  const lastIndex = value.length - 1;
  const lastNode = value[lastIndex];
  const [lastLeaf, lastOffset] = getLastLeafAndOffsetOfNode(lastNode);
  const selection: Selection = {
    anchor: { offset: 0, path: [0, 0] },
    focus: { offset: lastOffset, path: [lastIndex, lastLeaf] },
  };
  Transforms.setSelection(editor, selection);
  event.preventDefault();
  event.stopPropagation();
};
