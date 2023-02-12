import { Editor, Transforms } from "slate";
import {
  headingArray,
  SlateEditor,
  SlateElement,
} from "main/database/schemas/nodeSchema";
import { sourceStore } from "renderer/store/sourceStore";
import { noteStore } from "renderer/store/noteStore";
import { isBlockActive } from "../utils/isBlockActive";
import { expandCollapseHeading } from "../utils/expandCollapseHeading";
import { getInitialNode } from "../utils/getInitialNodes";
import { getSourceNodeFromSource } from "./getSourceNodeFromSource";

export const enterPress = async (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  if (event.code !== "Enter") return;
  const { selection } = editor;
  if (!selection) return;
  const defaultNode = getInitialNode();

  const { source } = sourceStore.getState();
  const { focusMode } = noteStore.getState();
  if (source && focusMode) {
    const slateSource = getSourceNodeFromSource(source);
    defaultNode.source = slateSource;
  }

  const { anchor, focus } = selection;

  const anchorStart = anchor.path[0];
  const focusStart = focus.path[0];
  const isInside = anchorStart === focusStart;
  if (!isInside) {
    editor.insertNode(defaultNode);
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  const anchorIsStart = Editor.isStart(editor, anchor, selection);
  const focusIsStart = Editor.isStart(editor, focus, selection);
  const currentNode = editor.children[focusStart] as SlateElement;

  const isHeading = Boolean(headingArray.find((h) => isBlockActive(editor, h)));
  const isCollapsed = currentNode.nestedNodes.length > 0;

  if (isHeading && isCollapsed) {
    event.preventDefault();
    event.stopPropagation();
    expandCollapseHeading([anchorStart], currentNode, editor);
    return;
  }

  const isStart = anchorIsStart && focusIsStart;

  if (isStart) {
    const isList = currentNode.list;
    const nextNode = editor.children[focusStart + 1] as
      | SlateElement
      | undefined;
    const nextIsList = nextNode?.list === true;
    const isImage = currentNode.blockType === "Image";
    const isLastElementOfList = isList && !nextIsList;
    if (isLastElementOfList) {
      Transforms.setNodes(editor, { list: false });
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (isImage) {
      const newPoint = anchorStart === 0 ? 0 : anchorStart + 1;
      const newAnchor = [newPoint];

      Transforms.insertNodes(editor, defaultNode, {
        at: newAnchor,
      });

      const a = { offset: 0, path: [newPoint, 0] };
      const baseSelection = { anchor: a, focus: a };
      editor.selection = baseSelection;
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }

  editor.insertNode(defaultNode);
  event.preventDefault();
  event.stopPropagation();
};
