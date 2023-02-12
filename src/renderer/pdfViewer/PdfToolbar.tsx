import React from "react";
import { grey } from "@mui/material/colors";
// MATERIAL
import {
  Grid,
  Typography,
  Toolbar,
  Card,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { makeStyles } from "@mui/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { windowStore } from "renderer/store/windowStore";
import { OpenDrawerBtn } from "renderer/app/layout/OpenDrawerBtn";
import { noteStore } from "renderer/store/noteStore";
import { drawerStore } from "renderer/store/drawerStore";
import { pdfToolbarStore, updateScaleValue } from "./pdfToolbarStore";
import { DiscardPdfBtn } from "./DiscardPdfBtn";
import { PdfSearchDialog } from "../hotkeys/hotkeysDialogs/pdfSearchDialog/PdfSearchDialog";

const ToolbarCard = styled(Card)`
  background-color: ${(props: { backgroundColor: string }) =>
    props.backgroundColor};
  color: lightgray;
`;

type StyleProps = {
  buttonDisable1: boolean;
  buttonDisable2: boolean;
  disabled?: boolean;
};

const useStyles = makeStyles(() => ({
  whiteText: { color: "lightgray" },
  arrowButton: {
    color: (props: StyleProps) => (props.disabled ? "gray" : "lightgray"),
  },
}));

const ZoomMenu = styled(Menu)`
  div::-webkit-scrollbar {
    width: 1em;
  }

  div::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  div::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
  }
`;

const StyledInput = styled("input")`
  font-family: Segoe UI;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
  text-align: right;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  margin-right: 3px;
  width: 40px;
  &:focus {
    outline: none;
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export default function PDFToolbar() {
  const [ClassProps, setClassProps] = React.useState({
    buttonDisable1: false,
    buttonDisable2: true,
  });

  const classes = useStyles(ClassProps);
  const CurrentPageNumber = pdfToolbarStore((s) => s.CurrentPageNumber);
  const setCurrentPageNumber = pdfToolbarStore((s) => s.setCurrentPageNumber);
  const MaxPageNumber = pdfToolbarStore((s) => s.MaxPageNumber);
  const CurrentPageScalePercent = pdfToolbarStore(
    (s) => s.CurrentPageScalePercent
  );
  const setCurrentPageScalePercent = pdfToolbarStore(
    (s) => s.setCurrentPageScalePercent
  );

  const onePage = MaxPageNumber === 1;

  React.useEffect(() => {
    if (CurrentPageNumber <= 1) {
      setClassProps({ buttonDisable1: true, buttonDisable2: false });
    } else if (CurrentPageNumber >= MaxPageNumber) {
      setClassProps({ buttonDisable1: false, buttonDisable2: true });
    } else {
      setClassProps({ buttonDisable1: false, buttonDisable2: false });
    }
  }, [CurrentPageNumber, MaxPageNumber]);

  const [anchorEl, setAnchorEl] = React.useState<
    (EventTarget & HTMLElement) | null
  >(null);

  const handleZoomClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleZoomClose = (percentage: number) => {
    if (typeof percentage === "number") setCurrentPageScalePercent(percentage);
    setAnchorEl(null);
  };

  const PageDecreaseOne = () => {
    const newNumber = CurrentPageNumber - 1;
    if (newNumber >= 1) setCurrentPageNumber(newNumber, "arrow");
  };

  const PageIncreaseOne = () => {
    const newNumber = CurrentPageNumber + 1;
    if (newNumber <= MaxPageNumber) setCurrentPageNumber(newNumber, "arrow");
  };

  const handlePageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newNumber = parseInt(event.target.value, 10);
    if (newNumber >= 1 && newNumber <= MaxPageNumber)
      setCurrentPageNumber(newNumber, "arrow");
  };

  const divRef = React.createRef<HTMLDivElement>();

  const windowWidth = windowStore((s) => s.windowWidth);
  const containerWidth = pdfToolbarStore((s) => s.containerWidth);
  const styles = pdfToolbarStore((s) => s.pdfViewerPalette);
  const isDrawerOpen = drawerStore((s) => s.isDrawerOpen);
  React.useEffect(() => {
    updateScaleValue();
  }, [containerWidth, windowWidth, divRef, isDrawerOpen]);

  const note = noteStore((s) => s.note);

  return (
    <ToolbarCard square ref={divRef} backgroundColor={styles.toolbarColor}>
      <Toolbar variant="dense">
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid
            item
            xs={4}
            container
            justifyContent="flex-start"
            alignItems="center"
          >
            {!note && !isDrawerOpen && <OpenDrawerBtn color="lightGray" />}
            <Typography style={{ padding: "0px" }}>
              {CurrentPageScalePercent} %
            </Typography>
            <IconButton
              className={classes.whiteText}
              onClick={handleZoomClick}
              size="small"
            >
              <ZoomInIcon />
            </IconButton>
            <ZoomMenu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleZoomClose}
              PaperProps={{
                style: {
                  zIndex: 0,
                  maxHeight: 160,
                  backgroundColor: grey[800],
                },
              }}
            >
              <div>
                {[50, 75, 100, 125, 150, 175, 200].map((number) => (
                  <MenuItem
                    key={number}
                    onClick={() => handleZoomClose(number)}
                    className={classes.whiteText}
                  >
                    {number} %
                  </MenuItem>
                ))}
              </div>
            </ZoomMenu>
          </Grid>
          {!onePage && (
            <Grid
              item
              xs={4}
              container
              justifyContent="center"
              alignItems="center"
            >
              <IconButton
                size="small"
                disabled={CurrentPageNumber === 1}
                className={classes.arrowButton}
                onClick={PageDecreaseOne}
              >
                <ChevronLeftIcon />
              </IconButton>
              <div>
                <StyledInput
                  type="number"
                  min="1"
                  max={`${MaxPageNumber}`}
                  value={CurrentPageNumber}
                  onChange={handlePageInput}
                  className={classes.whiteText}
                />
              </div>

              <Typography>{`/ ${MaxPageNumber}`}</Typography>
              <IconButton
                size="small"
                disabled={CurrentPageNumber >= MaxPageNumber}
                className={classes.arrowButton}
                onClick={PageIncreaseOne}
              >
                <ChevronRightIcon />
              </IconButton>
            </Grid>
          )}
          <Grid item xs={4} container justifyContent="flex-end">
            <DiscardPdfBtn />
          </Grid>
        </Grid>
      </Toolbar>
      <PdfSearchDialog />
    </ToolbarCard>
  );
}
