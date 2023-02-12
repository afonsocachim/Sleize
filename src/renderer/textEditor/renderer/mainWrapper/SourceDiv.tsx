import { IconButton } from "@mui/material";
import {
  BaseSlateSource,
  SlateElement,
} from "main/database/schemas/nodeSchema";
import { pdfToolbarStore } from "renderer/pdfViewer/pdfToolbarStore";
import { IconFromSourceType } from "renderer/components/IconFromExtension";
import { playerRef } from "renderer/app/noteScreen/VideoPlayerScreen";
import { getSourceFromIdInvoker } from "renderer/ipc/sourceInvokers";
import { dialogStore } from "renderer/hotkeys/dialogStore";
import { noteStore } from "renderer/store/noteStore";
import { sourceStore } from "renderer/store/sourceStore";

export const SourceDiv = ({
  source,
  element,
}: {
  source: BaseSlateSource;
  element: SlateElement;
}) => {
  const setCurrentPageNumber = pdfToolbarStore((s) => s.setCurrentPageNumber);

  const handleClick = async () => {
    if (!source.id) throw Error("No source");
    const result = await getSourceFromIdInvoker(source.id);
    if (result.error) {
      const { note } = noteStore.getState();
      if (!note) throw Error("No note");
      const currentDialog = "SOURCE_NOT_FOUND";
      sourceStore.setState({
        nodeToChangeSource: { note, element },
      });
      dialogStore.setState({ currentDialog });
      return;
    }
    setTimeout(() => {
      if (typeof source.time === "number" && playerRef.current) {
        playerRef.current.seekTo(source.time, "seconds");
      }
      if (typeof source.page === "number") {
        setCurrentPageNumber(source.page, "arrow");
      }
    }, 2000);
  };

  return (
    <IconButton
      size="small"
      style={{
        padding: 4,
      }}
      onClick={handleClick}
    >
      <IconFromSourceType ext={source.type} />
    </IconButton>
  );
};
