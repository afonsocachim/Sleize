import { isEmpty } from "lodash";
import { Transforms } from "slate";
import { SlateEditor } from "main/database/schemas/nodeSchema";
import { noteStore } from "renderer/store/noteStore";
import { clipboardStore } from "./clipboardStore";

export const movePaste = async (editor: SlateEditor) => {
  const { clipboardData } = clipboardStore.getState();
  if (!editor.selection) return;
  if (isEmpty(clipboardData)) return;
  const { note } = noteStore.getState();
  if (!note) throw Error("No note");
  Transforms.insertNodes(editor, clipboardData, { at: editor.selection });
  clipboardStore.setState({ clipboardData: [] });
};
