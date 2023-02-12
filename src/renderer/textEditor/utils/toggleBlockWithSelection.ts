import { cloneDeep } from "lodash";
import { Editor, Location, Transforms } from "slate";
import {
  SlateEditor,
  BlockTypes,
  SlateElement,
  headingArray,
  SlateBaseProperties,
} from "main/database/schemas/nodeSchema";
import { isBlockActive } from "./isBlockActive";
import { unwrapNestedNodesOnce } from "./unwrapNestedNodesOnce";

export const toggleBlockWithSelection = async (
  editor: SlateEditor,
  format: BlockTypes
) => {
  const { selection } = editor;
  if (!selection) return;
  const initialSelection = cloneDeep(selection);
  let first = selection.anchor;
  let last = selection.focus;
  if (selection.anchor.path[0] < selection.focus.path[0]) {
    first = selection.anchor;
    last = selection.focus;
  } else if (selection.anchor.path[0] > selection.focus.path[0]) {
    first = selection.focus;
    last = selection.anchor;
  } else if (selection.anchor.path[0] === selection.focus.path[0]) {
    first = selection.anchor;
    last = selection.focus;
  }
  const firstPosition = first.path[0];
  const lastPosition = last.path[0];
  if (typeof firstPosition !== "number") return;
  if (typeof lastPosition !== "number") return;
  const lastNode = editor.children[lastPosition] as SlateElement;
  const lastLeafIndex = lastNode.children.length - 1;
  const lastLeafOffset = lastNode.children[lastLeafIndex].text.length;
  const isBlock = isBlockActive(editor, format);
  const location: Location = {
    anchor: { offset: 0, path: [firstPosition, 0] },
    focus: { offset: lastLeafOffset, path: [lastPosition, lastLeafIndex] },
  };
  editor.selection = location;
  Editor.removeMark(editor, "clozeNumber");
  editor.selection = initialSelection;

  const newProperties: Partial<SlateBaseProperties> = {
    blockType: isBlock ? "Paragraph" : format,
    image: null,
    nestedNodes: [],
  };
  const resetListProps: Partial<SlateBaseProperties> = {
    ...newProperties,
    list: false,
  };
  const allowList = format === "Question" || format === "Paragraph";

  let wasHeading = false;
  headingArray.forEach((h) => {
    if (isBlockActive(editor, h)) {
      wasHeading = true;
    }
  });

  if (wasHeading) {
    const selectedNodes = [
      ...editor.children.slice(firstPosition, lastPosition + 1),
    ] as SlateElement[];
    const unwrappedNodes = unwrapNestedNodesOnce(selectedNodes);

    Transforms.removeNodes(editor, { at: initialSelection });
    Transforms.insertNodes(editor, unwrappedNodes, { at: [firstPosition] });

    const unwrappedNodesHashTable = unwrappedNodes.reduce(
      (prev, curr, index) => {
        const next = { ...prev };
        next[curr.id] = { block: curr, position: index };
        return next;
      },
      {} as { [id: string]: { block: SlateElement; position: number } }
    );

    selectedNodes.forEach((block) => {
      const blockPosition = unwrappedNodesHashTable[block.id].position;
      Transforms.setNodes(editor, resetListProps, {
        at: [firstPosition + blockPosition],
      });
    });

    editor.selection = initialSelection;
    return;
  }

  if (allowList) {
    Transforms.setNodes(editor, newProperties);
    return;
  }
  Transforms.setNodes(editor, resetListProps);
};
