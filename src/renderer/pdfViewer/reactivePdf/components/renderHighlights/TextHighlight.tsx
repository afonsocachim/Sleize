import { makeStyles } from "@mui/styles";
import { HighlightViewport } from "../../../../../main/database/schemas/highlightSchema";

const useStyles = makeStyles(() => ({
  root: { position: "absolute" },
  highlightPart: (props: { isScrolledTo: boolean; color: string }) => ({
    cursor: "pointer",
    position: "absolute",
    background: props.isScrolledTo ? "#ff4141" : props.color,
    transition: "background 0.3s",
  }),
  highlightPartsContainer: { opacity: 1 },
}));

export const TextHighlight = ({
  highlight,
  isScrolledTo,
}: {
  highlight: HighlightViewport;
  isScrolledTo: boolean;
}) => {
  const styleProps = { isScrolledTo, color: highlight.color };
  const classes = useStyles(styleProps);
  const { rects } = highlight?.position;

  return (
    <div className={classes.root}>
      <div className={classes.highlightPartsContainer}>
        {rects.map((rect, index) => (
          <div key={index} style={rect} className={classes.highlightPart} />
        ))}
      </div>
    </div>
  );
};
