import React from "react";
import ReactDOM from "react-dom";
import { styled } from "@mui/system";

export const ToolbarContainer = styled("div")(`
  position: absolute;
  marginTop: -6px;
  left: -1000;
  background-color: white;
  border-radius: 4px;
`);

export const Portal = ({ children }: { children: React.ReactNode }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};
