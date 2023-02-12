import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { Card, IconButton, Grid, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@mui/styles";
import { HighlightViewport } from "main/database/schemas/highlightSchema";
import { pdfStore } from "renderer/pdfViewer/pdfStore";
import { sourceStore } from "renderer/store/sourceStore";
import { renderStore } from "renderer/pdfViewer/reactivePdf/renderStore";
import { updateAndSetSourceInvoker } from "renderer/ipc/sourceInvokers";

const useStyles = makeStyles(() => ({
  card1: {
    width: "250px",
  },
  card2: {
    backgroundColor: "rgba(255,255,255,0.95)",
    width: "250px",
    padding: "8px",
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
    maxWidth: "calc(250px - 16px)",
    width: "calc(250px - 16px)",
    display: "block",
    breakWord: "break-all",
    border: "none",
    resize: "none",
    outline: "none",
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  saveButton: { width: "40px", height: "40px" },
}));

let allowHide = true;

export const CommentCard = ({
  onUpdate,
  highlight,
}: {
  onUpdate: () => void;
  highlight: HighlightViewport;
}) => {
  React.useEffect(() => onUpdate(), [onUpdate]);
  const classes = useStyles();

  const text = React.useRef(highlight.comment);
  const handleChange = (evt: ContentEditableEvent) => {
    text.current = evt.target.value;
  };

  React.useEffect(() => {
    text.current = highlight.comment;
    return () => {
      text.current = "";
    };
  }, [highlight.comment]);

  const updateHighlight = async () => {
    const { source } = sourceStore.getState();
    if (!source) throw Error("No pdf");
    const oldHighlights = [...source.highlights];

    const newHighlights = oldHighlights.map((h) => {
      if (h.id === highlight.id)
        return {
          ...h,
          comment: text.current,
        };
      return h;
    });
    const newSource = { ...source, highlights: newHighlights };
    await updateAndSetSourceInvoker(newSource);
    pdfStore.getState().hideTipAndSelection();
  };

  const deleteHighlight = async () => {
    const { source } = sourceStore.getState();
    if (!source) throw Error("No pdf");
    const oldHighlights = [...source.highlights];

    const deleteIndex = oldHighlights.findIndex((h) => h.id === highlight.id);
    oldHighlights.splice(deleteIndex, 1);

    const newSource = { ...source, highlights: oldHighlights };
    const { error } = await updateAndSetSourceInvoker(newSource);
    if (error) return;
    pdfStore.getState().hideTipAndSelection();
  };

  const [showComment, setShowComment] = React.useState(false);

  const showTooltip = () => {
    renderStore.setState({ allowChange: false });
  };

  React.useEffect(() => {
    allowHide = true;
    return () => {
      allowHide = true;
    };
  }, []);
  const hideTooltip = () => {
    if (allowHide) {
      renderStore.setState({ allowChange: true });
      renderStore.setState({ highlight: undefined });
      pdfStore.setState({ tipPosition: null });
    }
  };
  const onMouseLeave = () => {
    allowHide = true;
    hideTooltip();
  };

  const SmallCard = () => (
    <Grid className={classes.card1} container justifyContent="flex-end">
      <Card
        elevation={2}
        onMouseEnter={showTooltip}
        style={{ padding: 8 }}
        onMouseLeave={onMouseLeave}
      >
        <Grid container alignItems="center" justifyContent="flex-end">
          {highlight.comment.trim().length > 0 && (
            <Typography
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "calc(250px - 100px)",
              }}
              variant="body2"
            >
              {highlight.comment
                .replace(/<[^>]*>/g, " ")
                .replaceAll("&nbsp;", " ")}
            </Typography>
          )}
          <IconButton
            size="small"
            onClick={() => {
              setShowComment(true);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              deleteHighlight();
              allowHide = true;
              hideTooltip();
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Card>
    </Grid>
  );

  const BigCard = () => (
    <Card elevation={3} className={classes.card2} onMouseEnter={showTooltip}>
      <Grid container direction="column">
        <Grid item>
          <ContentEditable
            className={classes.textArea}
            html={text.current}
            onChange={handleChange}
          />
        </Grid>
        <Grid item container justifyContent="flex-end">
          <IconButton
            type="submit"
            color="primary"
            onClick={() => {
              allowHide = true;
              hideTooltip();
              updateHighlight();
            }}
          >
            <EditIcon className={classes.colorIcon} />
          </IconButton>
        </Grid>
      </Grid>
    </Card>
  );

  return <div>{showComment ? <BigCard /> : <SmallCard />}</div>;
};
