/* eslint-disable no-bitwise */
import React from "react";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import ClosedIcon from "@mui/icons-material/ChevronRight";
import OpenIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";
import SchoolIcon from "@mui/icons-material/SchoolOutlined";
import { styled } from "@mui/system";
import { Note } from "main/database/schemas/noteSchema";
import { Flashcard } from "main/database/schemas/flashcardSchema";
import { getNoteDescendants } from "renderer/store/noteUtils/getNoteDescendants";
import { dateStore } from "renderer/store/dateStore";
import { listNoteFlashcards } from "renderer/store/userUtils/listNoteFlashcards";
import { noteStore } from "renderer/store/noteStore";
import { prepareFlashcards } from "renderer/store/reviewUtils/prepareFlashcards";

const CheckIcon = styled(CheckCircleIcon)(({ theme }) => ({
  color: theme.palette.primary.dark,
}));

function binarySearch<T>(array: Array<T>, pred: (f: T) => boolean) {
  let lo = -1;
  let hi = array.length;
  while (1 + lo < hi) {
    const mi = lo + ((hi - lo) >> 1);
    if (pred(array[mi])) {
      hi = mi;
    } else {
      lo = mi;
    }
  }
  return hi;
}

const RootDiv = styled(Grid)`
  padding: 0;
  width: calc(300px - 14px - 16px);
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  border-radius: 4px;
`;

const MyTypography = styled(Typography)`
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(
    300px - 14px - 16px - 24px - 24px -
      ${(props: { depth: number }) => {
        return props.depth * 8;
      }}px
  );
`;

export const NoteListItem = (
  treeNode: Note,
  {
    depth,
    isOpen,
    onToggle,
  }: {
    depth: number;
    isOpen: boolean;
    onToggle: () => void;
  }
) => {
  const { text } = treeNode;

  const handleChooseNote = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    noteStore.setState({ note: treeNode });
  };
  const currentDateBySecond = dateStore((s) => s.currentDateBySecond);
  const lastMinuteOfToday = dateStore((s) => s.lastMinuteOfToday);
  const flashcardChange = dateStore((s) => s.flashcardChange);
  const [allIds, setAllIds] = React.useState<string[]>([]);
  const [cards, setCards] = React.useState<Flashcard[]>([]);
  const [showStudy, setShowStudy] = React.useState(false);
  const [mouseIn, setMouseIn] = React.useState(false);
  const [cardNumber, setCardNumber] = React.useState(0);

  React.useEffect(() => {
    const { id: noteId } = treeNode;
    const descendants = getNoteDescendants(treeNode);
    const localDescendantIds = descendants.map((desc) => desc.id);
    setAllIds([...localDescendantIds, noteId]);
  }, [treeNode]);

  React.useEffect(() => {
    const mySetCards = (c: Flashcard[]) => {
      setCards(c);
    };
    listNoteFlashcards(allIds, mySetCards);
  }, [allIds, flashcardChange, lastMinuteOfToday]);

  React.useEffect(() => {
    if (cards.length === 0) {
      if (showStudy) setShowStudy(false);
      return;
    }
    const firstDate = cards[0].dueDate;
    if (firstDate <= currentDateBySecond) {
      if (!showStudy) setShowStudy(true);
    } else if (showStudy) setShowStudy(false);
  }, [cards, currentDateBySecond, showStudy]);

  React.useEffect(() => {
    if (!mouseIn) return;
    const { currentDateBySecond: d } = dateStore.getState();
    const result = binarySearch(cards, (el: Flashcard) => {
      return el.dueDate >= d;
    });
    setCardNumber(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouseIn]);

  const handleOnToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };

  return (
    <RootDiv
      container
      alignItems="center"
      onMouseOver={() => {
        setMouseIn(true);
      }}
      onMouseOut={() => setMouseIn(false)}
    >
      <Grid
        item
        container
        justifyContent="flex-start"
        alignItems="center"
        style={{
          marginInlineStart: depth * 8,
          width: `calc(300px - 14px - 16px - 24px - ${depth * 8}px)`,
        }}
      >
        <IconButton
          size="small"
          onClick={handleOnToggle}
          style={{ padding: 0, width: 24 }}
        >
          {isOpen ? <OpenIcon /> : <ClosedIcon />}
        </IconButton>
        <MyTypography onClick={handleChooseNote} variant="body2" depth={depth}>
          {text}
        </MyTypography>
      </Grid>
      <Grid item style={{ width: "24px" }} container alignItems="center">
        {!showStudy ? (
          <IconButton size="small" style={{ visibility: "hidden", padding: 0 }}>
            <CheckIcon />
          </IconButton>
        ) : null}
        {showStudy ? (
          <Tooltip title={`${cardNumber} cards`}>
            <IconButton
              size="small"
              style={{ padding: 0 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prepareFlashcards([treeNode]);
              }}
            >
              <SchoolIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </Grid>
    </RootDiv>
  );
};
