import React from "react";
import { Box } from "@mui/material";
import { noteStore } from "renderer/store/noteStore";
import { reviewStore } from "renderer/store/reviewStore";
import { windowStore } from "renderer/store/windowStore";
import { sourceStore } from "renderer/store/sourceStore";
import { HotkeyHelperDialog } from "renderer/hotkeys/hotkeysDialogs/hotkeyHelperDialog/HotkeyHelperDialog";
import { SourceTreeDialog } from "renderer/hotkeys/hotkeysDialogs/sourceTreeDialog/SourceTreeDialog";
import { SourceNotFoundDialog } from "renderer/hotkeys/hotkeysDialogs/sourceNotFoundDialog/SourceNotFoundDialog";
import { NoteSearchDialog } from "renderer/hotkeys/hotkeysDialogs/NoteSearchDialog";
import { studyAllHotkey } from "renderer/hotkeys/hotkeyFunctions/studyAllHotkey";
import { toggleDrawerHotkey } from "renderer/hotkeys/hotkeyFunctions/toggleDrawerHotkey";
import { userReceivers } from "renderer/ipc/userReceivers";
import { flashcardReceiver } from "renderer/ipc/flashcardReceiver";
import { getLastMinuteOfToday } from "renderer/utils/getLastMinuteOfToday";
import { getCurrentDate } from "renderer/utils/getCurrentDate";
import { dateStore } from "renderer/store/dateStore";
import { NoteScreen } from "./noteScreen/NoteScreen";
import { NoteDrawer } from "./noteDrawer/NoteDrawer";
import { Dashboard } from "../dashboard/Dashboard";
import { ReviewScreen } from "./reviewScreen/ReviewScreen";
import { MainContainer } from "./layout/MainContainer";
import { DrawerContainer } from "./layout/DrawerContainer";
import { OnlineArticleDialog } from "./OnlineArticleDialog";
import { OnlineVideoDialog } from "./OnlineVideoDialog";

userReceivers();
flashcardReceiver();

setInterval(() => {
  const { lastMinuteOfToday } = dateStore.getState();
  const newLastMinute = getLastMinuteOfToday();
  if (lastMinuteOfToday !== newLastMinute) {
    dateStore.setState({ lastMinuteOfToday: newLastMinute });
  }
  dateStore.setState({ currentDateBySecond: getCurrentDate() });
}, 1000);

export const AppPage = () => {
  const note = noteStore((s) => s.note);
  const source = sourceStore((s) => s.source);

  const reviewMode = reviewStore((s) => s.reviewMode);
  React.useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      windowStore.setState({ windowHeight: height, windowWidth: width });
    }
    window.addEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    window.addEventListener("keydown", studyAllHotkey);
    window.addEventListener("keydown", toggleDrawerHotkey);
    return () => {
      window.removeEventListener("keydown", studyAllHotkey);
      window.removeEventListener("keydown", toggleDrawerHotkey);
    };
  }, []);

  const noteOrSource = Boolean(note || source);
  return (
    <Box
      style={{
        display: "flex",
      }}
    >
      <HotkeyHelperDialog />
      <NoteSearchDialog />
      <SourceTreeDialog />
      <SourceNotFoundDialog />
      <OnlineArticleDialog />
      <OnlineVideoDialog />
      <DrawerContainer>
        <NoteDrawer />
      </DrawerContainer>
      <MainContainer>
        {!reviewMode && !noteOrSource && <Dashboard />}
        {!reviewMode && noteOrSource && <NoteScreen />}
        {reviewMode && <ReviewScreen />}
      </MainContainer>
    </Box>
  );
};
