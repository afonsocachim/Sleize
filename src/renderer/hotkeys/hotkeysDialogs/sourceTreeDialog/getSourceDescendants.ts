import { Source } from "main/database/schemas/sourceSchema";
import { userStore } from "renderer/store/userStore";

export const getSourceDescendants = (source: Source) => {
  const { id } = source;
  const { userSourceList } = userStore.getState();
  let descendants: Source[] = [];

  const search = (tree: Source[], ids: string[]) => {
    const children = tree.filter((node) => ids.includes(node.parent));

    if (children.length > 0) {
      descendants = [...descendants, ...children];

      search(
        tree,
        children.map((node) => node.id)
      );
    }
  };

  search(userSourceList, [id]);

  return descendants;
};
