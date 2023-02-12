import React from "react";
import { Grid } from "@mui/material";
import SplitPane from "react-split-pane";
import { Source } from "main/database/schemas/sourceSchema";
import { PdfViewer } from "renderer/pdfViewer/PdfViewer";
import { drawerStore } from "renderer/store/drawerStore";
import { OpenDrawerBtn } from "renderer/app/layout/OpenDrawerBtn";
import { VideoPlayerScreen } from "./VideoPlayerScreen";

export const SourceScreen = ({ source }: { source: Source }) => {
  const [isVideo, setIsVideo] = React.useState(false);
  const isDrawerOpen = drawerStore((s) => s.isDrawerOpen);

  React.useEffect(() => {
    if (source.type === "LOCAL_VIDEO" || source.type === "ONLINE_VIDEO") {
      setIsVideo(true);
    } else {
      setIsVideo(false);
    }
  }, [source.type]);
  const maxHeight = window.innerHeight - 50;
  const initialWidth = isDrawerOpen
    ? window.innerWidth - 300
    : window.innerWidth;
  const videoContainerWidth = initialWidth - 68;
  const initialHeight = (videoContainerWidth * 9) / 16;
  const height = initialHeight > maxHeight ? maxHeight : initialHeight;
  const width = (height * 16) / 9;

  return isVideo ? (
    <Grid
      container
      justifyContent="flex-start"
      style={{
        height: "100vh",
        maxHeight: "100vw",
        backgroundColor: "black",
        width: initialWidth,
      }}
    >
      <div
        style={{
          width: 34,
          maxWidth: 34,
          overflow: "hidden",
        }}
      >
        <OpenDrawerBtn color="lightGray" />
      </div>
      <Grid
        container
        style={{ width: videoContainerWidth }}
        justifyContent="center"
      >
        <VideoPlayerScreen source={source} width={width} />
      </Grid>
      <div style={{ width: 34 }} />
    </Grid>
  ) : (
    <SplitPane split="vertical" defaultSize="100%">
      <PdfViewer source={source} />
    </SplitPane>
  );
};
