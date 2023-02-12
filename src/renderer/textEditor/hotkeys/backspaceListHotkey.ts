import { Editor, Transforms } from "slate";
import { SlateEditor, SlateElement } from "main/database/schemas/nodeSchema";
import { getInitialNode } from "../utils/getInitialNodes";
import { getLastLeafAndOffsetOfNode } from "../utils/getLastLeafAndOffsetOfNode";

export const backspaceHotkey = async (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  if (event.code !== "Backspace") return;
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
  const currentNode = editor.children[focusStart] as SlateElement;
  const [lastLeafIndex, lastLeafOffset] =
    getLastLeafAndOffsetOfNode(currentNode);
  const emptyNode = lastLeafIndex === 0 && lastLeafOffset === 0;
  if (emptyNode) {
    const newNode = getInitialNode();
    Transforms.setNodes(editor, newNode, { at: [anchorStart] });
  }
  if (!currentNode.list) return;
  const validBlock =
    currentNode.blockType === "Paragraph" ||
    currentNode.blockType === "Question";
  if (!validBlock) return;
  Transforms.setNodes(editor, { list: false });
  event.preventDefault();
  event.stopPropagation();
};
