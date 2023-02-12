import React from "react";
import { styled } from "@mui/system";
import { Typography, Grid, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { exitReviewScreen } from "renderer/store/reviewUtils/exitReviewScreen";
import { ReviewSlate } from "renderer/app/reviewScreen/reviewSlate/ReviewSlate";
import { resetReviewStore, reviewStore } from "renderer/store/reviewStore";
import { listCurrentFlashcards } from "renderer/store/reviewUtils/listCurrentFlashcards";
import { ReviewScreenFooter, AnswerButton } from "./ReviewScreenFooter";
import { NoFlashcards } from "./NoFlashcards";

const MyGrid = styled(Grid)(`
  height: 100vh;
  flex-grow: 1;
  background-color: #f7f7f7;
`);
const HeaderGrid = styled(Grid)(`
  padding-right: 8px;
`);
const FooterGrid = styled(Grid)(`
  height: 57.5;
  overflow: hidden;
  padding-bottom: 16px;
`);
const MainGrid = styled(Grid)(`
  padding-top: 40px;
  flex-grow: 1;
  width: 100%;
`);

const escKey = (event: KeyboardEvent) => {
  if (event.code !== "Escape") return;
  exitReviewScreen();
};

export const ReviewScreen = () => {
  const currentCard = reviewStore((s) => s.currentCard);
  const loadingCard = reviewStore((s) => s.loadingCard);
  const remainingCardsNumber = reviewStore((s) => s.remainingCardsNumber);

  React.useEffect(() => {
    listCurrentFlashcards();
    window.addEventListener("keydown", escKey);
    return () => {
      window.removeEventListener("keydown", escKey);
    };
  }, []);

  React.useEffect(() => {
    return resetReviewStore;
  }, []);

  const FlashcardScreen = () => {
    if (!currentCard) throw Error("No card");
    return (
      <>
        <MainGrid container justifyContent="center">
          <ReviewSlate card={currentCard} />
        </MainGrid>
        <FooterGrid>
          <ReviewScreenFooter card={currentCard} />
        </FooterGrid>
      </>
    );
  };

  const EndScreen = () => (
    <>
      <MainGrid container justifyContent="center">
        <NoFlashcards />
      </MainGrid>
      <FooterGrid />
    </>
  );

  const LoadingScreen = () => (
    <>
      <MainGrid />
      <FooterGrid>
        <AnswerButton disabled variant="contained">
          Show Answer
        </AnswerButton>
      </FooterGrid>
    </>
  );

  return (
    <MyGrid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
    >
      <HeaderGrid
        container
        justifyContent="space-between"
        alignItems="center"
        style={{ height: 40, overflow: "hidden" }}
      >
        <IconButton onClick={exitReviewScreen}>
          <CancelIcon />
        </IconButton>
        <Typography variant="body1">
          {remainingCardsNumber === 0
            ? ""
            : `${remainingCardsNumber} cards to go`}
        </Typography>
      </HeaderGrid>
      {loadingCard && <LoadingScreen />}
      {!loadingCard &&
        (remainingCardsNumber === 0 ? <EndScreen /> : <FlashcardScreen />)}
    </MyGrid>
  );
};
