import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { Card, IconButton, Grid, ToggleButton, Tooltip } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CommentIcon from "@mui/icons-material/Comment";
import PushPinIcon from "@mui/icons-material/PushPin";
import SaveIcon from "@mui/icons-material/Save";
import { makeStyles } from "@mui/styles";
import { colorArray } from "renderer/utils/colors";
import { noteStore } from "renderer/store/noteStore";
import { renderStore } from "../../renderStore";
import { addHighlight } from "./addHighlight";

const useStyles = makeStyles(() => ({
  card1: { backgroundColor: "rgba(255,255,255,0.95)" },
  card2: {
    padding: "8px",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  colorIcon: {
    "border-radius": "50%",
    overflow: "hidden",
    filter: "brightness(0.9)",
  },
  textAreaGrid: {
    padding: "8px",
  },
  textArea: {
    maxWidth: "200px",
    width: "200px",
    display: "block",
    breakWord: "break-all",
    border: "none",
    resize: "none",
    outline: "none",
    backgroundColor: "rgba(255,255,255,0.92)",
    fontWeight: "bold",
  },
  saveButton: { width: "40px", height: "40px" },
}));

export const CreateHighlight = ({ onUpdate }: { onUpdate: () => void }) => {
  React.useEffect(() => onUpdate(), [onUpdate]);
  const classes = useStyles();

  const note = noteStore((s) => s.note);

  const [showComment, setShowComment] = React.useState(false);
  const [pinSelected, setPinSelected] = React.useState(false);
  const [colorHex, setColorHex] = React.useState(colorArray[0].hex);
  const text = React.useRef("");
  const setText = (evt: ContentEditableEvent) => {
    text.current = evt.target.value;
  };

  const handleAddHighlight = (color: string) => {
    addHighlight(color, text.current, pinSelected);
  };

  React.useEffect(() => {
    renderStore.setState({ highlightBeingCreated: true });
    return () => {
      renderStore.setState({ highlightBeingCreated: false });
    };
  }, []);

  React.useEffect(() => {
    text.current = "";
    return () => {
      text.current = "";
    };
  }, []);

  const PinButton = () =>
    note ? (
      <Tooltip title="Add comment to note">
        <ToggleButton
          value="check"
          selected={pinSelected}
          style={{
            borderRadius: 50,
            border: "0px solid white",
            padding: 4,
            margin: 0,
          }}
          onClick={() => {
            setPinSelected(true);
          }}
        >
          <PushPinIcon />
        </ToggleButton>
      </Tooltip>
    ) : null;

  const SaveButton = () => (
    <IconButton
      style={{
        borderRadius: 50,
        border: "0px solid white",
        padding: 4,
        margin: 0,
      }}
      onClick={() => {
        handleAddHighlight(colorHex);
      }}
    >
      <SaveIcon />
    </IconButton>
  );

  const SmallCard = () => (
    <Card elevation={2} className={classes.card1}>
      <IconButton size="small" onClick={() => setShowComment(true)}>
        <CommentIcon />
      </IconButton>
      <PinButton />
      {colorArray.map(({ hex }, index) => (
        <IconButton
          key={index}
          size="small"
          onClick={() => {
            handleAddHighlight(hex);
          }}
        >
          <BorderColorIcon
            className={classes.colorIcon}
            style={{ backgroundColor: hex }}
          />
        </IconButton>
      ))}
    </Card>
  );

  const BigCard = () => (
    <Card elevation={3} className={classes.card2} contentEditable={false}>
      <Grid container direction="column">
        <Grid item className={classes.textAreaGrid}>
          <ContentEditable
            className={classes.textArea}
            html={text.current}
            onChange={setText}
          />
        </Grid>
        <Grid item container justifyContent="space-between">
          <SaveButton />
          <PinButton />
          {colorArray.map(({ hex }, index) => (
            <IconButton
              key={index}
              size="small"
              onClick={() => {
                setColorHex(hex);
              }}
            >
              <BorderColorIcon
                className={classes.colorIcon}
                style={{ backgroundColor: hex }}
              />
            </IconButton>
          ))}
        </Grid>
      </Grid>
    </Card>
  );

  return showComment ? <BigCard /> : <SmallCard />;
};
