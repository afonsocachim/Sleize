import React from "react";
import { Grid } from "@mui/material";
import { styled } from "@mui/system";
import { Source } from "main/database/schemas/sourceSchema";
import { pdfStore } from "renderer/pdfViewer/pdfStore";
import { slateStore } from "renderer/store/slateStore";
import { drawerStore } from "renderer/store/drawerStore";
import { noteStore } from "renderer/store/noteStore";
import { windowStore } from "renderer/store/windowStore";
import { PdfLoader } from "./reactivePdf/components/pdfLoader/PdfLoader";
import PdfToolbar from "./PdfToolbar";
import {
  pdfToolbarStore,
  setPaletteToArticle,
  setPaletteToPdf,
  updateScaleValue,
} from "./pdfToolbarStore";

const SpecialGrid = styled(Grid)`
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const PdfViewer = ({ source }: { source: Source }) => {
  const [path, setPath] = React.useState("");
  const mainWrapperRatio = slateStore((s) => s.mainWrapperRatio);
  const isDrawerOpen = drawerStore((s) => s.isDrawerOpen);
  const windowHeight = windowStore((s) => s.windowHeight);
  const windowWidth = windowStore((s) => s.windowWidth);
  const note = noteStore((s) => s.note);
  React.useEffect(() => {
    pdfStore.setState({ highlights: source.highlights });
  }, [source, source.highlights]);

  React.useEffect(() => {
    if (source.type === "ONLINE_ARTICLE") {
      setPaletteToArticle();
    } else {
      setPaletteToPdf();
    }
  }, [source.type]);

  React.useEffect(() => {
    setPath(source.path);
  }, [source]);

  const styles = pdfToolbarStore((s) => s.pdfViewerPalette);

  const [myWidth, setMyWidth] = React.useState("400px");

  React.useEffect(() => {
    if (!note && isDrawerOpen) {
      setMyWidth(`100vw - 300px`);
    } else if (!note && !isDrawerOpen) {
      setMyWidth(`100vw`);
    } else if (note && isDrawerOpen) {
      setMyWidth(`(100vw - 300px) * ${1 - mainWrapperRatio}`);
    } else if (note && !isDrawerOpen) {
      setMyWidth(`100vw * ${1 - mainWrapperRatio}`);
    }
    updateScaleValue();
  }, [windowHeight, windowWidth, mainWrapperRatio, isDrawerOpen, note]);

  return (
    <div
      style={{
        backgroundColor: styles.backgroundColor,
        overflow: "hidden",
      }}
    >
      <PdfToolbar />

      <SpecialGrid
        container
        justifyContent="center"
        style={{
          display: "flex",
          height: "calc(100vh - 48px)",
          paddingLeft: "10px",
          width: `calc(${myWidth})`,
          overflowX: "scroll",
          overflowY: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            position: "relative",
          }}
        >
          <PdfLoader pdfPath={path} />
        </div>
      </SpecialGrid>
    </div>
  );
};
