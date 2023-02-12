import React from "react";
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { noteStore } from "renderer/store/noteStore";
import { slateStore } from "renderer/store/slateStore";
import { windowStore } from "renderer/store/windowStore";
import { drawerStore } from "renderer/store/drawerStore";
import { sourceStore } from "renderer/store/sourceStore";
import { OpenDrawerBtn } from "../layout/OpenDrawerBtn";
import { EditNoteTitleBtn } from "./headerButtons/EditNoteTitleBtn";
import { DeleteNoteBtn } from "./headerButtons/DeleteNoteBtn";
import { FocusModeBtn } from "./headerButtons/FocusModeBtn";
import { ShowSourcesSwitch } from "./headerButtons/ShowSourcesSwitch";

const MyGrid = styled(Grid)(`
  padding-top: 8px;
  padding-right: 16px;
  padding-bottom: 16px;
`);

const IconGrid = styled(Grid)(`
  margin-left: auto;
`);

let containerPrevOffsetLeft: undefined | number;
let containerPrevTop = 64;

export const NoteScreenHeader = () => {
  const note = noteStore((s) => s.note);
  const source = sourceStore((s) => s.source);
  const divRef = React.createRef<HTMLDivElement>();
  const text = noteStore((s) => s.note?.text || "");

  const windowHeight = windowStore((s) => s.windowHeight);
  const windowWidth = windowStore((s) => s.windowWidth);
  const mainWrapperRatio = slateStore((s) => s.mainWrapperRatio);
  const isDrawerOpen = drawerStore((s) => s.isDrawerOpen);
  React.useEffect(() => {
    if (!divRef.current) return;
    const { current } = divRef;
    const { offsetLeft } = current;
    const boundingRect = current.getBoundingClientRect();
    const { bottom } = boundingRect;
    if (containerPrevOffsetLeft !== offsetLeft) {
      containerPrevOffsetLeft = offsetLeft;
      slateStore.setState({ containerOffsetLeft: offsetLeft });
    }
    if (containerPrevTop !== bottom) {
      containerPrevTop = bottom;
      slateStore.setState({ containerTop: bottom });
    }
  }, [windowHeight, windowWidth, divRef, mainWrapperRatio, isDrawerOpen]);

  if (!note) return null;

  return (
    <MyGrid
      container
      justifyContent="space-between"
      alignItems="center"
      ref={divRef}
    >
      <Grid item container alignItems="center" xs={7}>
        <OpenDrawerBtn />
        <Typography
          variant="h2"
          style={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            width: "calc(100% - 2em)",
          }}
        >
          {text}
        </Typography>
      </Grid>
      <IconGrid
        item
        container
        justifyContent="flex-end"
        alignItems="center"
        xs={5}
      >
        <EditNoteTitleBtn text={text} />
        <DeleteNoteBtn />
        <ShowSourcesSwitch />
        {source && <FocusModeBtn />}
      </IconGrid>
    </MyGrid>
  );
};
