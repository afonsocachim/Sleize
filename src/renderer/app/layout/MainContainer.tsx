import { Box } from "@mui/material";

export const MainContainer = ({ children }: { children: React.ReactNode }) => {
  return <Box sx={{ flexGrow: 1, height: "100vh" }}>{children}</Box>;
};
