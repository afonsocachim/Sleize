import { v4 } from "uuid";
import { Transforms } from "slate";
import { SlateEditor, SlateElement } from "main/database/schemas/nodeSchema";
import { clipboardStore } from "./clipboardStore";

export const moveCut = async (editor: SlateEditor) => {
  if (!editor.selection) return;
  const { children, selection } = editor;
  const anchorPath = editor.selection.anchor.path[0];
  const focusPath = editor.selection.focus.path[0];
  const startNodeIndex = anchorPath < focusPath ? anchorPath : focusPath;
  const endNodeIndex = focusPath > anchorPath ? focusPath : anchorPath;
  const clonedChildren = [...children] as SlateElement[];
  const valueToCut = clonedChildren.slice(startNodeIndex, endNodeIndex + 1);
  const valueToStore = valueToCut.map((n) => {
    if (n.blockType === "Question") return n;
    return { ...n, id: v4() };
  });
  Transforms.removeNodes(editor, { at: selection });

  clipboardStore.setState({ clipboardData: valueToStore });
};
