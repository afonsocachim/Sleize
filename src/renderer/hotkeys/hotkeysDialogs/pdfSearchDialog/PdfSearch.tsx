import React from "react";
import { Grid, IconButton } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { styled } from "@mui/system";
import { slateStore } from "renderer/store/slateStore";
import { searchPdf } from "../../../pdfViewer/reactivePdf/viewer/searchCommands";

const mySetRanges = () => {
  const highlights = Array.from(document.querySelectorAll("#SlateDecorator"));
  slateStore.setState({ findsArray: highlights });
};

const CleanInput = styled("input")`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 4px;
  width: 300px;
  max-width: 300px;
  height: 30px;
  maxheight: 30px;
  &:focus {
    outline: none;
  }
  border: 0px;

  font-weight: 400;
  font-size: 1rem;
  line-height: 1.3;
  letter-pacing: -0.01562em;
`;

export const PdfSearch = () => {
  const [searchString, setSearchString] = React.useState("");

  React.useEffect(() => {
    mySetRanges();
  }, [searchString]);

  const handlePdfSearch = (n: 1 | -1 | 0) => {
    if (n === 1) searchPdf.next(searchString);
    if (n === -1) searchPdf.previous(searchString);
    if (n === 0) searchPdf.reset();
  };

  const handleSearchChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" || e.code === "ArrowDown") {
      handlePdfSearch(1);
    }
    if (e.code === "ArrowUp") {
      handlePdfSearch(-1);
    }
  };

  return (
    <Grid container alignItems="center">
      <CleanInput
        value={searchString}
        onChange={(e) => {
          setSearchString(e.target.value);
          if (e.target.value.length === 1) return;
          searchPdf.next(e.target.value);
        }}
        onKeyDown={handleSearchChange}
        autoFocus
      />
      <IconButton size="small" onClick={() => handlePdfSearch(-1)}>
        <ArrowLeftIcon />
      </IconButton>
      <IconButton size="small" onClick={() => handlePdfSearch(1)}>
        <ArrowRightIcon />
      </IconButton>
    </Grid>
  );
};
