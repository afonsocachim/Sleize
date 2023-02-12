import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export const Copyright = () => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mt: 8, mb: 4 }}
    >
      {`Sleize Copyright © `}
      <Link color="inherit" href="https://mui.com/" />
      {new Date().getFullYear()}.
    </Typography>
  );
};
