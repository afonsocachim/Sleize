import { Grid } from "@mui/material";
import { AddSourceBtn } from "./AddSourceBtn";
import { HomeBtn } from "./HomeBtn";
import { ShowSourcesBtn } from "./ShowSourcesBtn";

export const DrawerFooter = () => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      style={{ padding: "0px 16px" }}
    >
      <Grid container item xs={6}>
        <HomeBtn />
      </Grid>
      <Grid container item xs={6} justifyContent="flex-end">
        <ShowSourcesBtn />
        <AddSourceBtn />
      </Grid>
    </Grid>
  );
};
