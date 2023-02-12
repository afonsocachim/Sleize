import React from "react";
import { Source } from "main/database/schemas/sourceSchema";
import { PdfViewer } from "renderer/pdfViewer/PdfViewer";
import { drawerStore } from "renderer/store/drawerStore";
import { slateStore } from "renderer/store/slateStore";
import { VideoPlayerScreen } from "./VideoPlayerScreen";

export const SplitSourceScreen = ({ source }: { source: Source }) => {
  const [isVideo, setIsVideo] = React.useState(false);

  React.useEffect(() => {
    if (source.type === "LOCAL_VIDEO" || source.type === "ONLINE_VIDEO") {
      setIsVideo(true);
    } else {
      setIsVideo(false);
    }
  }, [source.type]);
  const isDrawerOpen = drawerStore((s) => s.isDrawerOpen);
  const mainWrapperRatio = slateStore((s) => s.mainWrapperRatio);
  let width = 0;
  const containerWidth = window.innerWidth;
  // if (isDrawerOpen) width = "calc((100vw - 300px) / 2)";
  if (isDrawerOpen) {
    width = (containerWidth - 300) * (1 - mainWrapperRatio);
  }
  if (!isDrawerOpen) {
    width = containerWidth * (1 - mainWrapperRatio);
  }

  return isVideo ? (
    <VideoPlayerScreen source={source} width={width} />
  ) : (
    <PdfViewer source={source} />
  );
};
