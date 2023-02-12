import React from "react";
import { styled } from "@mui/system";
import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { handleNoteDrop } from "renderer/store/noteUtils/handleNoteDrop";
import { userStore } from "renderer/store/userStore";
import { sectionStore } from "renderer/store/sectionStore";
import { NoteListItem } from "./NoteListItem";
import { SectionSubheading } from "../sectionSubheading/SectionSubheading";

const MyDiv = styled("div")(`
  height: calc(100vh - 180px);
  & ul {
    height: 100%
  }
  overflow: scroll;
  ::-webkit-scrollbar {
    width: 14px;
  }

  ::-webkit-scrollbar-thumb {
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 9999px;
    background-color: #aaaaaa;
  }
  ::-webkit-scrollbar-corner {
    background: rgba(0, 0, 0, 0);
  }
`);

const getDepth = (
  tree: NodeModel<unknown>[],
  id: string | number,
  depth = 0
): number => {
  const target = tree.find((node) => node.id === id);

  if (target) {
    return getDepth(tree, target.parent, depth + 1);
  }

  return depth;
};

export const NoteList = () => {
  const noteDocumentList = userStore((s) => s.noteDocumentList);

  const [noteList, setNoteList] = React.useState<Array<NodeModel<unknown>>>([]);
  React.useEffect(() => {
    setNoteList(noteDocumentList);
  }, [noteDocumentList]);

  const section = sectionStore((s) => s.section);

  if (!section) return null;

  return (
    <>
      <SectionSubheading />
      <MyDiv>
        <Tree
          tree={noteList}
          rootId={section.id}
          render={NoteListItem as (n: NodeModel<unknown>) => JSX.Element}
          dragPreviewRender={(monitorProps) => (
            <div>{monitorProps.item.text}</div>
          )}
          onDrop={handleNoteDrop}
          canDrop={(tree, { dropTargetId }) => {
            const depth = getDepth(tree, dropTargetId);

            // can nest 6 levels
            if (depth > 5) {
              return false;
            }
          }}
        />
      </MyDiv>
    </>
  );
};
