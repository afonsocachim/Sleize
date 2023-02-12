import { VideoSource, PdfSource } from "main/database/schemas/nodeSchema";
import { Source } from "main/database/schemas/sourceSchema";
import { videoStore } from "renderer/store/videoStore";
import { pdfToolbarStore } from "renderer/pdfViewer/pdfToolbarStore";

export const getSourceNodeFromSource = (source: Source) => {
  const { id, type } = source;
  const isVideo = type === "LOCAL_VIDEO" || type === "ONLINE_VIDEO";
  if (isVideo) {
    const { currentTime: time } = videoStore.getState();
    const videoSource: VideoSource = {
      type,
      id,
      time,
      page: null,
      color: null,
    };
    return videoSource;
  }
  const { CurrentPageNumber: page } = pdfToolbarStore.getState();
  const pdfSource: PdfSource = {
    type: "LOCAL_PDF",
    id,
    time: null,
    page,
    color: "",
  };
  return pdfSource;
};
