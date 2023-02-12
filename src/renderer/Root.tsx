import React from "react";
import { CssBaseline } from "@mui/material";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/system";
import { ToastContainer } from "react-toastify";
import { Router } from "./Router";
import { lightTheme } from "./styles/lightTheme";
import "react-toastify/dist/ReactToastify.css";
import "react-reflex/styles.css";
import "./index.css";
import "./fonts.css";

export const Root = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <ToastContainer autoClose={1000} />
      <HashRouter>
        <Router />
      </HashRouter>
    </ThemeProvider>
  );
};
