import { Grid, IconButton } from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { userStore } from "renderer/store/userStore";
import { closeDrawer } from "../../../store/drawerStore";
import { UsernameNotes } from "./UsernameNotes";

export const DrawerHeader = () => {
  const user = userStore((s) => s.user);
  if (!user) throw Error("No user at NoteDrawerHeader");

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      style={{ paddingBottom: "8px" }}
    >
      <UsernameNotes />
      <Grid>
        <IconButton onClick={closeDrawer}>
          <ChevronLeft />
        </IconButton>
      </Grid>
    </Grid>
  );
};
