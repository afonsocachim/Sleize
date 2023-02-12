import { cloneDeep } from "lodash";
import { SlateEditor, SlateElement } from "main/database/schemas/nodeSchema";
import { noteStore } from "renderer/store/noteStore";
import { disableMark } from "../utils/helperFunctions";
import { isBlockActive } from "../utils/isBlockActive";
import { enableClozeNumber, isClozeNumber } from "../utils/clozeFunctions";

export const toggleCloze = async (editor: SlateEditor, increase: boolean) => {
  const { note } = noteStore.getState();
  if (!note) throw Error("no note");
  if (!isBlockActive(editor, "Question")) return;
  if (!editor || !editor.selection) return;
  const valueClone = cloneDeep(editor.children) as SlateElement[];
  const childrenIndex = editor.selection.focus.path[0];
  const currentNode = valueClone[childrenIndex];
  if (currentNode.blockType !== "Question") return;

  if (isClozeNumber(editor)) {
    disableMark(editor, "clozeNumber");
  } else {
    let n = 1;
    const increaseValue = increase ? 1 : 0;
    currentNode.children.forEach((leaf) => {
      if (typeof leaf.clozeNumber === "number" && leaf.clozeNumber >= n)
        n = leaf.clozeNumber + increaseValue;
    });

    enableClozeNumber(editor, n);
  }
};
