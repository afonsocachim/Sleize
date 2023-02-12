import React from "react";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ClosedIcon from "@mui/icons-material/ChevronRight";
import OpenIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";
import { BaseSource, Source } from "main/database/schemas/sourceSchema";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { IconFromSourceType } from "renderer/components/IconFromExtension";
import { ConfirmDialog } from "renderer/components/dialogs/ConfirmDialog";
import { SimpleDialog } from "renderer/components/dialogs/SimpleDialog";
import { chooseSource, sourceStore } from "renderer/store/sourceStore";
import {
  removeSourceInvoker,
  updateSourceInvoker,
} from "renderer/ipc/sourceInvokers";
import { resetDialogStore } from "renderer/hotkeys/dialogStore";
import { sourceTreeStore } from "./sourceTreeStore";
import { SourceModel } from "./types";
import { getSourceDescendants } from "./getSourceDescendants";

const FadeInButton = styled(IconButton)`
  animation: fadein 1s;

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const HoverDiv = styled(Grid)`
  border-radius: 4px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const SourceItem = (
  treeNode: NodeModel<{
    doc: Source;
  }>,
  {
    depth,
    isOpen,
    onToggle,
  }: { depth: number; isOpen: boolean; onToggle: () => void }
) => {
  const { text, droppable, data } = treeNode;
  const source = sourceStore((s) => s.source);
  if (!data) throw Error("No data");
  const { doc } = data;

  const initialContainerWidth = window.innerWidth * 0.8;
  const containerWidth = initialContainerWidth - 65;
  const gridWidth = containerWidth - depth * 16 - 75;
  const textWidth = gridWidth - 24;

  const [showButtons, setShowButtons] = React.useState(false);
  const [showDeleteSource, setShowDeleteSource] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);

  const viewSource = () => {
    chooseSource(doc);
    resetDialogStore();
  };

  const goToDirectory = () => {
    const { directory: oldDirectory, sourceHash } = sourceTreeStore.getState();
    const lastDirectory = oldDirectory[oldDirectory.length - 1];
    const directoriesToAdd: Source[] = [];
    const checkIfEqualToParent = (s: Source) => {
      directoriesToAdd.unshift(s);
      if (s.parent === lastDirectory.id) return;
      const parentNode = sourceHash[s.parent] as Source | undefined;
      if (!parentNode) throw Error("no parent node");
      checkIfEqualToParent(parentNode);
    };
    checkIfEqualToParent(doc);
    const directoryModelsToAdd: SourceModel[] = directoriesToAdd.map((s) => ({
      id: s.id,
      parent: s.parent,
      text: s.name,
      droppable: s.type === "FOLDER",
      data: {
        doc: s,
      },
    }));

    sourceTreeStore.setState({
      directory: [...oldDirectory, ...directoryModelsToAdd],
    });
  };

  const handleOnToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };

  const handleEdit = async (s: string) => {
    const newSource: BaseSource = { ...doc, name: s };
    const result = await updateSourceInvoker(newSource);
    if (result.error) return false;
    return true;
  };

  const handleDelete = async () => {
    const descendants = getSourceDescendants(doc);
    const ids = descendants.map((d) => d.id);
    const isSourceDisplayed = doc.id === source?.id;
    if (isSourceDisplayed) {
      sourceStore.setState({ source: undefined });
    }
    await removeSourceInvoker([...ids, doc.id]);
  };

  return (
    <HoverDiv
      container
      justifyContent="space-between"
      onClick={droppable ? goToDirectory : () => {}}
      onMouseOver={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
      style={{
        cursor: droppable ? "pointer" : "auto",
        padding: 0,
        paddingLeft: depth * 16,
        paddingTop: 2,
        paddingBottom: 2,
        width: containerWidth,
        height: 30,
      }}
    >
      <Grid
        item
        container
        justifyContent="flex-start"
        alignItems="center"
        style={{
          width: gridWidth,
        }}
      >
        {droppable && (
          <IconButton
            size="small"
            onClick={handleOnToggle}
            style={{ padding: 0, width: 24 }}
          >
            {isOpen ? <OpenIcon /> : <ClosedIcon />}
          </IconButton>
        )}
        {!droppable && doc.type !== "FOLDER" && (
          <div style={{ padding: 0, paddingLeft: 4, width: 24 }}>
            <IconFromSourceType ext={doc.type} />
          </div>
        )}
        <Typography
          variant="body2"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: textWidth,
          }}
        >
          {text}
        </Typography>
      </Grid>
      {showButtons && (
        <Grid>
          {!droppable && (
            <Tooltip title="View">
              <FadeInButton
                size="small"
                style={{ padding: 0, width: 24 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  viewSource();
                }}
                disabled={doc.id === source?.id}
              >
                <VisibilityIcon />
              </FadeInButton>
            </Tooltip>
          )}
          <Tooltip title="Edit title">
            <FadeInButton
              size="small"
              style={{ padding: 0, width: 24 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowEdit(true);
              }}
            >
              <EditIcon />
            </FadeInButton>
          </Tooltip>
          <Tooltip title="Delete">
            <FadeInButton
              size="small"
              style={{ padding: 0, width: 24 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDeleteSource(true);
              }}
            >
              <DeleteIcon />
            </FadeInButton>
          </Tooltip>
        </Grid>
      )}
      <SimpleDialog
        open={showEdit}
        setOpen={setShowEdit}
        stringName="Title"
        buttonText="Edit"
        action={handleEdit}
        string={doc.name}
      />
      <ConfirmDialog
        open={showDeleteSource}
        setOpen={setShowDeleteSource}
        buttonText="Delete"
        action={handleDelete}
        string={
          doc.type === "FOLDER"
            ? "Delete source and its descendants?"
            : "Delete source?"
        }
      />
    </HoverDiv>
  );
};
