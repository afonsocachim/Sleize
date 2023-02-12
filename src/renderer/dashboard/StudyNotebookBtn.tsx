/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { styled } from "@mui/system";
import { IconButton, Tooltip } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { NotebookObj } from "main/database/schemas/librarySchema";
import { Flashcard } from "main/database/schemas/flashcardSchema";
import { studyNotebook } from "renderer/store/reviewUtils/studyNotebook";
import { dateStore } from "renderer/store/dateStore";
import { listNoteFlashcards } from "renderer/store/userUtils/listNoteFlashcards";
import { getNoteDescendants } from "renderer/store/noteUtils/getNoteDescendants";
import { getSectionNotesInvoker } from "renderer/ipc/notesInvoker";
import { Note } from "main/database/schemas/noteSchema";

const FadeInButton = styled(IconButton)`
  padding: 0;
  animation: fadein 1s;

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const StudyNotebookBtn = ({
  notebookObj,
}: {
  notebookObj: NotebookObj;
}) => {
  const currentDateBySecond = dateStore((s) => s.currentDateBySecond);
  const lastMinuteOfToday = dateStore((s) => s.lastMinuteOfToday);
  const flashcardChange = dateStore((s) => s.flashcardChange);
  const [allIds, setAllIds] = React.useState<string[]>([]);
  const [cards, setCards] = React.useState<Flashcard[]>([]);
  const [showStudy, setShowStudy] = React.useState(false);

  React.useEffect(() => {
    const f = async () => {
      const result = await getSectionNotesInvoker(notebookObj.sectionIds);
      if (result.error) return;
      const notes = result.data as Note[];
      const allNoteIds: string[] = [];
      await Promise.all(
        notes.map((note) => {
          const descendants = getNoteDescendants(note);
          const localDescendantIds = descendants.map((desc) => desc.id);
          allNoteIds.push(...localDescendantIds);
          allNoteIds.push(note.id);
          return undefined;
        })
      );
      setAllIds(allNoteIds);
    };
    f();
  }, [notebookObj.sectionIds]);

  React.useEffect(() => {
    const mySetCards = (c: Flashcard[]) => {
      setCards(c);
    };
    listNoteFlashcards(allIds, mySetCards);
  }, [allIds, lastMinuteOfToday, flashcardChange]);

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
  return (
    <Tooltip title={showStudy ? "Study notebook" : "All done!"}>
      <div>
        <FadeInButton
          size="small"
          onClick={() => studyNotebook(notebookObj)}
          disabled={!showStudy}
        >
          <SchoolIcon />
        </FadeInButton>
      </div>
    </Tooltip>
  );
};
