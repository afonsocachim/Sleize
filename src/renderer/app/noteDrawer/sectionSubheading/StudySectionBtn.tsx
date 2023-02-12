/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React from "react";
import SchoolIcon from "@mui/icons-material/SchoolOutlined";
import { IconButton, Tooltip } from "@mui/material";
import { Flashcard } from "main/database/schemas/flashcardSchema";
import { dateStore } from "renderer/store/dateStore";
import { sectionStore } from "renderer/store/sectionStore";
import { userStore } from "renderer/store/userStore";
import { listNoteFlashcards } from "renderer/store/userUtils/listNoteFlashcards";
import { getNoteDescendants } from "renderer/store/noteUtils/getNoteDescendants";
import { studySection } from "renderer/store/reviewUtils/studySection";
import { getSectionNotesInvoker } from "renderer/ipc/notesInvoker";
import { Note } from "main/database/schemas/noteSchema";

export const StudySectionBtn = () => {
  const noteDocumentList = userStore((s) => s.noteDocumentList);
  const section = sectionStore((s) => s.section);
  const currentDateBySecond = dateStore((s) => s.currentDateBySecond);
  const lastMinuteOfToday = dateStore((s) => s.lastMinuteOfToday);
  const flashcardChange = dateStore((s) => s.flashcardChange);
  const [allIds, setAllIds] = React.useState<string[]>([]);
  const [cards, setCards] = React.useState<Flashcard[]>([]);
  const [showStudy, setShowStudy] = React.useState(false);

  React.useEffect(() => {
    const f = async () => {
      if (!section) throw Error("No section");
      const result = await getSectionNotesInvoker([section.id]);
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
  }, [noteDocumentList, section]);

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

  if (!section) return null;
  const handleStudyBtn = () => {
    studySection(section);
  };

  return (
    <div>
      {showStudy && (
        <Tooltip title="Study section">
          <IconButton
            size="small"
            onClick={handleStudyBtn}
            style={{ padding: 0 }}
          >
            <SchoolIcon />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};
