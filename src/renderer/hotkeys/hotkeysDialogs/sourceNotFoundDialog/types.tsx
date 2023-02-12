import { Source } from "main/database/schemas/sourceSchema";
import { NodeModel } from "@minoru/react-dnd-treeview";

export type SourceModel = NodeModel<{
  doc: Source | undefined;
}>;
