import { createTheme } from "@mui/material";

export const font = "'Open Sans', sans-serif;";

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#1E88E5",
      dark: "#1A5685",
      contrastText: "#fff",
    },
    secondary: {
      main: "#1c6bb1",
      dark: "#0e406c",
      contrastText: "#fff",
    },
  },
  typography: {
    // note Tree titles
    body2: {
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01562em",
    },
    // main texts
    h1: {
      fontWeight: 300,
      fontSize: "3.5rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01562em",
    },
    // note title
    // note header text
    h2: {
      fontWeight: 400,
      fontSize: "1.5rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01562em",
    },
    fontFamily: font,
  },
});
