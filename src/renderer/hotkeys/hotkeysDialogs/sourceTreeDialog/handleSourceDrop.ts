import { isString } from "lodash";
import { updateSourceInvoker } from "renderer/ipc/sourceInvokers";
import { userStore } from "renderer/store/userStore";
import { SourceModel } from "./types";

export const handleSourceDrop = (newNoteList: SourceModel[]) => {
  const sortedSourceList = newNoteList.sort((note1, note2) =>
    note1.id < note2.id ? 0 : 1
  );
  const { userSourceList } = userStore.getState();

  const equalLength = sortedSourceList.length === userSourceList.length;
  if (!equalLength)
    throw Error("Note and DocumentNote lists have different lengths");
  userSourceList.forEach(async (sourceDoc, index) => {
    const docParent = sourceDoc.parent;
    const modelParent = sortedSourceList[index].parent;
    if (!isString(modelParent)) throw Error("No noteParent");
    if (docParent !== modelParent) {
      const newSource = { ...sourceDoc, parent: modelParent };
      updateSourceInvoker(newSource);
    }
  });
};
