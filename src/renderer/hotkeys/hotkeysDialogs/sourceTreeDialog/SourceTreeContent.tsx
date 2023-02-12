import React from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import { styled } from "@mui/system";
import { IconButton, Tooltip, Grid, List, Typography } from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { userStore } from "renderer/store/userStore";
import { SimpleDialog } from "renderer/components/dialogs/SimpleDialog";
import { SourceItem } from "./SourceItem";
import { sourceTreeStore } from "./sourceTreeStore";
import { handleSourceDrop } from "./handleSourceDrop";
import { createFolder } from "./createFolder";

const MyTypography = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(80vw - 100px);
`;

const MySpan = styled("span")`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100px;
`;

const MyDiv = styled("div")(`
  height: 100%;
  & ul {
    height: 100%;
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

export const SourceTreeContent = () => {
  const [openCreate, setOpenCreate] = React.useState(false);
  const userSourceList = userStore((s) => s.userSourceList);
  const directory = sourceTreeStore((s) => s.directory);

  const handleSourceClick = (index: number) => {
    const { directory: oldDirectory } = sourceTreeStore.getState();
    const newDirectory = oldDirectory.slice(0, index + 1);
    sourceTreeStore.setState({ directory: newDirectory });
  };

  const initialTreeNodeList = userSourceList.map((s) => ({
    id: s.id,
    parent: s.parent,
    text: s.name,
    droppable: s.type === "FOLDER",
    data: {
      doc: s,
    },
  }));

  const handleCreateFolder = async (s: string) => {
    createFolder(s);
    if (s.length === 0) return false;
    return true;
  };

  return (
    <div>
      <Grid container justifyContent="space-between" alignItems="center">
        <MyTypography variant="h2">
          {directory.map((d, i) => (
            <MySpan onClick={() => handleSourceClick(i)} key={d.id}>
              {d.text}
              {i < directory.length - 1 && "\\"}
            </MySpan>
          ))}
        </MyTypography>
        <div>
          <Tooltip title="Add Folder">
            <IconButton onClick={() => setOpenCreate(true)} size="small">
              <CreateNewFolderIcon />
            </IconButton>
          </Tooltip>
          <SimpleDialog
            open={openCreate}
            setOpen={setOpenCreate}
            stringName="Create folder"
            buttonText="Create"
            action={handleCreateFolder}
            string=""
          />
        </div>
      </Grid>

      <List style={{ height: "calc(100% - 100px)" }}>
        <MyDiv>
          <Tree
            tree={initialTreeNodeList}
            rootId={directory[directory.length - 1].id}
            render={SourceItem}
            dragPreviewRender={(monitorProps) => (
              <div>{monitorProps.item.text}</div>
            )}
            onDrop={handleSourceDrop}
          />
        </MyDiv>
      </List>
    </div>
  );
};
