import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";
import {
  Flashcard,
  SuperMemoGrade,
} from "main/database/schemas/flashcardSchema";
import { reviewStore } from "renderer/store/reviewStore";
import {
  answerFlashcard,
  practiceFlashcard,
} from "renderer/store/reviewUtils/answerFlashcard";
import { listCurrentFlashcards } from "renderer/store/reviewUtils/listCurrentFlashcards";
import { getFlashcardTime } from "./getFlashcardTime";

export const AnswerButton = styled(Button)(`
  margin: 0px 8px;
`);

export const ReviewScreenFooter = (props: { card: Flashcard }) => {
  const { card } = props;
  const showAnswer = reviewStore((s) => s.showAnswer);

  const handleSubmitAnswer = async (n: SuperMemoGrade) => {
    reviewStore.setState({ loadingCard: true });
    await answerFlashcard(card, n);
    await listCurrentFlashcards();
  };
  const handleShowAnswer = () => {
    reviewStore.setState({ showAnswer: true });
  };

  const keyBindFunction = (event: KeyboardEvent) => {
    const { showAnswer: ans } = reviewStore.getState();
    if (event.code === "Space") {
      if (ans) handleSubmitAnswer(1);
      if (!ans) handleShowAnswer();
    }
    if (event.code === "Digit1" && ans) handleSubmitAnswer(0);

    if (event.code === "Digit2" && ans) handleSubmitAnswer(1);
  };

  React.useEffect(() => {
    document.addEventListener("keydown", keyBindFunction);
    return () => {
      document.removeEventListener("keydown", keyBindFunction);
    };
  }, []);

  const wrongText = `Wrong (${getFlashcardTime(
    practiceFlashcard(card, 0)[0].interval
  )})`;
  const rightText = `Correct (${getFlashcardTime(
    practiceFlashcard(card, 1)[0].interval
  )})`;

  return (
    <div>
      {showAnswer && (
        <>
          <AnswerButton
            onClick={() => handleSubmitAnswer(0)}
            variant="contained"
            color="secondary"
            style={{ textTransform: "none" }}
          >
            {wrongText}
          </AnswerButton>
          <AnswerButton
            onClick={() => handleSubmitAnswer(1)}
            variant="contained"
            style={{ textTransform: "none" }}
          >
            {rightText}
          </AnswerButton>
        </>
      )}
      {!showAnswer && (
        <AnswerButton onClick={handleShowAnswer} variant="contained">
          Show Answer
        </AnswerButton>
      )}
    </div>
  );
};
