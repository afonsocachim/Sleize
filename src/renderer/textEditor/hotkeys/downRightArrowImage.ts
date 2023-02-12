import { Editor } from "slate";
import { SlateEditor, SlateElement } from "main/database/schemas/nodeSchema";
import { getInitialNode } from "../utils/getInitialNodes";

export const downRightArrowImage = async (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  const isCorrectArrow =
    event.code === "ArrowRight" || event.code === "ArrowDown";
  if (!isCorrectArrow) return;
  const { selection } = editor;
  if (!selection) return;
  const { anchor, focus } = selection;

  const anchorStart = anchor.path[0];
  const focusStart = focus.path[0];
  const isInside = anchorStart === focusStart;
  if (!isInside) return;
  const lastElementPosition = editor.children.length - 1;
  const isEnd = lastElementPosition === anchorStart;
  if (!isEnd) return;

  const anchorIsStart = Editor.isStart(editor, anchor, selection);
  const focusIsStart = Editor.isStart(editor, focus, selection);
  const currentNode = editor.children[focusStart] as SlateElement;

  const isStart = anchorIsStart && focusIsStart;

  if (!isStart) return;
  const isImage = currentNode.blockType === "Image";
  if (!isImage) return;
  event.preventDefault();
  event.stopPropagation();
  const defaultNode = getInitialNode();
  editor.insertNode(defaultNode);
};
