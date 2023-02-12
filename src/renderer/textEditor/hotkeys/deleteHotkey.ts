import { Editor, Transforms } from "slate";
import { SlateEditor, SlateElement } from "main/database/schemas/nodeSchema";
import { getInitialNode } from "../utils/getInitialNodes";

// used to not remove image when delete is pressed in an empty line before
export const deleteHotkey = async (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  const validKeys = event.code === "Delete" || event.code === "Backspace";
  if (!validKeys) return;
  const { selection } = editor;
  if (!selection) return;
  const { anchor, focus } = selection;

  const anchorStart = anchor.path[0];
  const focusStart = focus.path[0];
  const isInside = anchorStart === focusStart;
  if (!isInside) return;

  const anchorIsStart = Editor.isStart(editor, anchor, selection);
  const focusIsStart = Editor.isStart(editor, focus, selection);

  const isStart = anchorIsStart && focusIsStart;

  if (!isStart) return;
  const currentNode = editor.children[anchorStart] as SlateElement | undefined;
  const nextNode = editor.children[anchorStart + 1] as SlateElement | undefined;
  if (!currentNode) throw Error("no node");
  if (!nextNode && currentNode.blockType === "Image") {
    const baseNode = getInitialNode();
    Transforms.insertNodes(editor, baseNode, { at: [anchorStart + 1] });
    Transforms.removeNodes(editor, { at: [anchorStart] });
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  if (nextNode?.blockType !== "Image") return;
  Transforms.removeNodes(editor, { at: [anchorStart] });
  event.preventDefault();
  event.stopPropagation();
};
