import { styled } from "@mui/system";
import { IconButton } from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { openDrawer, drawerStore } from "../../store/drawerStore";

export const OpenDrawerBtn = ({ color }: { color?: string }) => {
  const isDrawerOpen = drawerStore((s) => s.isDrawerOpen);
  return (
    <IconButton
      type="button"
      size="small"
      onClick={openDrawer}
      disabled={isDrawerOpen}
      style={{ visibility: !isDrawerOpen ? "visible" : "hidden" }}
    >
      <ChevronRight style={{ color: color }} />
    </IconButton>
  );
};
