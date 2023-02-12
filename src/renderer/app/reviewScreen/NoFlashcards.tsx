import { Typography, Grid } from "@mui/material";
import { styled } from "@mui/system";
import noMoreFlashcards from "renderer/assets/noMoreFlashcards.png";

const MyTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
}));

export const NoFlashcards = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <img src={noMoreFlashcards} alt="" style={{ height: "50%" }} />
      <MyTypography variant="h1">Congratulations!</MyTypography>
    </Grid>
  );
};
