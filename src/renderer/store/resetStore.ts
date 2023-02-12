import { resetDashboardStore } from "./dashboardStore";
import { resetUserStore } from "./userStore";
import { resetDrawerStore } from "./drawerStore";
import { resetNoteStore } from "./noteStore";
import { resetSourceStore } from "./sourceStore";
import { resetReviewStore } from "./reviewStore";
import { resetSlateStore } from "./slateStore";
import { resetWindowStore } from "./windowStore";
import { resetVideoStore } from "./videoStore";
import { resetSvgStore } from "./svgStore";
import { resetSectionStore } from "./sectionStore";

export const resetStore = () => {
  resetDrawerStore();
  resetNoteStore();
  resetReviewStore();
  resetSectionStore();
  resetSourceStore();
  resetSlateStore();
  resetSvgStore();
  resetUserStore();
  resetVideoStore();
  resetWindowStore();
  resetDashboardStore();
};

export const homeReset = () => {
  resetSectionStore();
  resetNoteStore();
  resetSourceStore();
  resetSvgStore();
  resetReviewStore();
  resetDashboardStore();
};

export const handleHomeClick = () => {
  resetNoteStore();
  resetSourceStore();
  resetSvgStore();
  resetReviewStore();
  resetDashboardStore();
};

export const commandLineReset = () => {
  resetSourceStore();
  resetSvgStore();
  resetReviewStore();
  resetDashboardStore();
};
