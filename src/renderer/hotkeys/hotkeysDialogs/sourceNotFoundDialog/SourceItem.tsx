import React from "react";
import { toast } from "react-toastify";
import { cloneDeep } from "lodash";
import { Grid, Typography, ListItemButton } from "@mui/material";
import { styled } from "@mui/system";
import { FileSource } from "main/database/schemas/sourceSchema";
import { IconFromSourceType } from "renderer/components/IconFromExtension";
import { getNotesInvoker, updateNoteInvoker } from "renderer/ipc/notesInvoker";
import { sourceStore } from "renderer/store/sourceStore";
import { BaseSlateSource } from "main/database/schemas/nodeSchema";
import { noteStore } from "renderer/store/noteStore";
import { dialogStore, resetDialogStore } from "renderer/hotkeys/dialogStore";
import { userStore } from "renderer/store/userStore";

export const SourceItem = ({ source }: { source: FileSource }) => {
  const initialContainerWidth = window.innerWidth * 0.8;
  const containerWidth = initialContainerWidth - 65;
  const gridWidth = containerWidth - 75;
  const textWidth = gridWidth - 24;
  const noteDocumentList = userStore((s) => s.noteDocumentList);
  const disabled = dialogStore((s) => !s.allowDialogReset);

  const handleChooseSource = async () => {
    const { nodeToChangeSource } = sourceStore.getState();
    dialogStore.setState({ allowDialogReset: false });
    const n = cloneDeep(nodeToChangeSource);
    if (!n) throw Error("No nodeToChangeSource2");

    const oldSource = n.element.source;
    if (!oldSource) throw Error("No old source");
    const id = toast.loading("Updating all references");

    await Promise.all(
      noteDocumentList.map(async (userNote) => {
        const { nodes: noteNodes } = userNote.data;
        const newNodes = noteNodes.map((element) => {
          const { source: elSource } = element;
          if (!elSource) return element;
          if (elSource.id !== oldSource.id) return element;
          const newSlateSource: BaseSlateSource = {
            type: elSource.type,
            id: source.id,
            time: elSource.time,
            page: elSource.page,
            color: elSource.color,
          };
          return { ...element, source: newSlateSource };
        });
        const newNote = {
          ...userNote,
          data: { ...userNote.data, nodes: newNodes },
        };
        await updateNoteInvoker(newNote);
        return null;
      })
    );
    const noteResult = await getNotesInvoker([n.note.id]);
    if (noteResult.error) throw Error("Getting updated Note error");

    noteStore.setState({ note: noteResult.data[0] });
    sourceStore.setState({ nodeToChangeSource: null });
    dialogStore.setState({ allowDialogReset: true });
    toast.update(id, {
      render: "All references changes",
      type: "success",
      isLoading: false,
      autoClose: 0,
    });
    resetDialogStore();
  };

  return (
    <ListItemButton
      disabled={disabled}
      onClick={handleChooseSource}
      style={{
        padding: 0,
        paddingTop: 2,
        paddingBottom: 2,
        width: containerWidth,
        height: 30,
        borderRadius: 4,
      }}
    >
      <Grid container justifyContent="space-between">
        <Grid
          item
          container
          justifyContent="flex-start"
          alignItems="center"
          style={{
            width: gridWidth,
          }}
        >
          <div style={{ padding: 0, paddingLeft: 4, width: 24 }}>
            <IconFromSourceType ext={source.type} />
          </div>
          <Typography
            variant="body2"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: textWidth,
            }}
          >
            {source.name}
          </Typography>
        </Grid>
      </Grid>
    </ListItemButton>
  );
};
