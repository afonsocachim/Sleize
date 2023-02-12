import { Note } from "main/database/schemas/noteSchema";
import { userStore } from "../userStore";

export const getNoteDescendants = (note: Note) => {
  const treeData = userStore.getState().noteDocumentList;
  let descendants: Note[] = [];

  const search = (tree: Note[], ids: string[]) => {
    const children = tree.filter((node) => ids.includes(node.parent));

    if (children.length > 0) {
      descendants = [...descendants, ...children];

      search(
        tree,
        children.map((node) => node.id)
      );
    }
  };

  search(treeData, [note.id]);

  return descendants;
};
