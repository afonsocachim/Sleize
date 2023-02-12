import { debounce } from "lodash";
import { Note } from "main/database/schemas/noteSchema";
import { SlateElement } from "main/database/schemas/nodeSchema";
import { updateNoteInvoker } from "renderer/ipc/notesInvoker";
import { getInitialNode } from "main/ipc/userController/userHandlers/createUserHandler/getInitialNodes";
import { Editor, Transforms } from "slate";
import { slateStore } from "../slateStore";
import { editorContainer } from "./editorContainer";

export const slateUpdate = (value: SlateElement[], note: Note) => {
  const newNote = { ...note, data: { ...note.data, nodes: value } };
  updateNoteInvoker(newNote);
};

const debouncedSlateUpdate = debounce(slateUpdate, 500);
export const slateOnChange = (value: SlateElement[], note: Note) => {
  slateStore.setState({ value });
  const { editor } = editorContainer;
  const selectionChanged = editor.operations.some(
    (op) => op.type === "set_selection"
  );
  if (selectionChanged) {
    slateStore.setState({ slateSelection: editor.selection });
    Transforms.setNodes(
      editor,
      { selected: false },
      {
        at: {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [value.length - 1, 0], offset: 0 },
        },
      }
    );
    Transforms.setNodes(editor, { selected: true }, { at: editor.selection });
  }
  // If there is no text and cloze selected removes cloze on empty initial text
  if (value.length === 1) {
    const { children } = value[0];
    if (children.length === 1) {
      const child = children[0];
      const { text, clozeNumber } = child;
      if (text.length === 0 && typeof clozeNumber === "number") {
        const initialNode = getInitialNode();

        Transforms.insertNodes(editor, initialNode, { at: [1] });
        Transforms.removeNodes(editor, { at: [0] });
        return;
      }
    }
  }
  debouncedSlateUpdate(value, note);
};
