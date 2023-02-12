import { isString } from "lodash";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { updateNoteInvoker } from "renderer/ipc/notesInvoker";
import { userStore } from "../userStore";

export const handleNoteDrop = (newNoteList: NodeModel[]) => {
  const sortedNoteList = newNoteList.sort((note1, note2) =>
    note1.id < note2.id ? 0 : 1
  );
  const { noteDocumentList } = userStore.getState();

  const equalLength = sortedNoteList.length === noteDocumentList.length;
  if (!equalLength)
    throw Error("Note and DocumentNote lists have different lengths");
  noteDocumentList.forEach(async (noteDoc, index) => {
    const docParent = noteDoc.parent;
    const noteParent = sortedNoteList[index].parent;
    if (!isString(noteParent)) throw Error("No noteParent");
    if (docParent === noteParent) return;
    const newNote = { ...noteDoc, parent: noteParent };
    updateNoteInvoker(newNote);
  });
};
