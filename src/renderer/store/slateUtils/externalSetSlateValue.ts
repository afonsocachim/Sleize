import { cloneDeep } from "lodash";
import { SlateElement } from "main/database/schemas/nodeSchema";
import { updateNoteInvoker } from "renderer/ipc/notesInvoker";
import { noteStore } from "../noteStore";
import { slateStore } from "../slateStore";
import { editorContainer } from "./editorContainer";

export const externalSetSlateValue = async (newValue: SlateElement[]) => {
  const { editor } = editorContainer;
  const clonedValue = cloneDeep(newValue);
  editor.selection = null;
  editor.children = clonedValue;
  editor.onChange();
  slateStore.setState({ value: clonedValue });
  const { note } = noteStore.getState();
  if (!note) throw Error("No Note");
  const newNote = { ...note, data: { ...note.data, nodes: clonedValue } };
  await updateNoteInvoker(newNote);
};
