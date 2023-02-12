import { getLevelDb } from "main/database/createDbServer";
import { mainStore } from "main/store/mainStore";
import { isEqual } from "lodash";
import { editFlashcardsFromNodes } from "main/utils/editFlashcardsFromNodes";

export const editFlashcardsLister = async () => {
  const db = await getLevelDb();
  db.notecollection.update$.subscribe((rxEvent) => {
    const prev = rxEvent.previousDocumentData;
    if (typeof prev === "string") return;
    if (!mainStore.getState().user) return;
    if (isEqual(rxEvent.documentData.data.nodes, prev.data.nodes)) return;
    const newId = rxEvent.documentData.id;

    // eslint-disable-next-line promise/no-nesting
    db.notecollection
      .findOne({ selector: { id: newId } })
      .exec()
      .then((doc) => {
        if (doc) {
          editFlashcardsFromNodes(doc, db);
        }
      })
      .catch((e) => console.error(e));
  });
};
