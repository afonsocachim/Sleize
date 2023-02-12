import React from "react";
import { Grid, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import ReactPlayer from "react-player";
import {
  BaseSource,
  Source,
  VideoSource,
} from "main/database/schemas/sourceSchema";
import { SimpleDialog } from "renderer/components/dialogs/SimpleDialog";
import { videoStore } from "renderer/store/videoStore";
import { sourceStore } from "renderer/store/sourceStore";
import {
  getVideoAndSubBufferInvoker,
  updateLocalSourcePathInvoker,
  updateAndSetSourceInvoker,
} from "renderer/ipc/sourceInvokers";
import { constructFileFromLocalFileData } from "renderer/utils/constructFileFromLocalFileData";

export const playerRef: { current: ReactPlayer | null } = {
  current: null,
};

export const VideoPlayerScreen = ({
  source,
  width,
}: {
  source: Source;
  width: number;
}) => {
  const [videoUrl, setVideoUrl] = React.useState("");
  const [subUrl, setSubUrl] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const playing = videoStore((s) => s.playing);

  const handleChangeUrl = async (s: string) => {
    const newSource: BaseSource = { ...source, path: s };
    const result = await updateAndSetSourceInvoker(newSource);
    if (result.error) return false;
    return true;
  };

  const renderSub = (newSubUrl: string) => {
    let counter = 0;
    const i = setInterval(() => {
      const track = document.querySelector("track");
      if (counter > 4) clearInterval(i);
      counter += 1;
      if (!track) return;
      track.src = newSubUrl;
      setSubUrl(newSubUrl);
      clearInterval(i);
    }, 1000);
  };

  React.useEffect(() => {
    const togglePlaying = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.code === "KeyP") {
        videoStore.setState({ playing: !videoStore.getState().playing });
      }
    };
    window.addEventListener("keypress", togglePlaying);
    return () => {
      window.removeEventListener("keypress", togglePlaying);
    };
  }, []);

  React.useEffect(() => {
    const { path: videoPath, type: videoType } = source;
    const track = document.querySelector("track");
    if (track) {
      track.src = "";
    }
    setSubUrl("");
    if (!videoPath) return;
    if (videoType === "ONLINE_VIDEO") {
      setVideoUrl(videoPath);
      return;
    }
    if (videoType !== "LOCAL_VIDEO") return;

    const n = async () => {
      const result = await getVideoAndSubBufferInvoker(source as VideoSource);
      if (result.error) {
        if (result.message === "Invalid file path")
          updateLocalSourcePathInvoker(source);
        return;
      }
      const { subFileData, videoFileData } = result.data;
      const videoFile = constructFileFromLocalFileData(videoFileData);
      const videFileUrl = URL.createObjectURL(videoFile);
      setVideoUrl(videFileUrl);
      if (!subFileData) return;
      const subFile = constructFileFromLocalFileData(subFileData);
      const subFileUrl = URL.createObjectURL(subFile);
      renderSub(subFileUrl);
    };
    n();
  }, [source]);

  React.useEffect(() => {
    return () => {
      videoStore.setState({ currentPlayer: null });
    };
  }, []);

  return (
    <Grid
      container
      style={{
        backgroundColor: "black",
        height: "100vh",
        width,
      }}
      direction="column"
      justifyContent="space-between"
    >
      <ReactPlayer
        url={videoUrl}
        playing={playing}
        ref={(player) => {
          playerRef.current = player;
          videoStore.setState({ currentPlayer: player });
        }}
        controls
        width={width}
        height={(width * 9) / 16}
        onProgress={(s) => {
          videoStore.setState({ currentTime: s.playedSeconds });
        }}
        config={{
          file: {
            tracks: [
              {
                kind: "subtitles",
                src: subUrl,
                srcLang: "en",
                label: "english",
                default: true,
              },
            ],
          },
        }}
      />
      <Grid container justifyContent="space-between">
        <IconButton
          onClick={() => {
            sourceStore.setState({ source: undefined });
          }}
        >
          <CancelIcon style={{ color: "#202020" }} />
        </IconButton>
        {source.type === "ONLINE_VIDEO" && (
          <IconButton
            onClick={() => {
              setOpen(true);
            }}
          >
            <EditIcon style={{ color: "lightGray" }} />
            <SimpleDialog
              open={open}
              setOpen={setOpen}
              string={source.path}
              stringName="Url"
              buttonText="Edit"
              action={handleChangeUrl}
            />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
};
