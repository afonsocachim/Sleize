/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { styled } from "@mui/system";
import { IconButton, Tooltip } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { dateStore } from "renderer/store/dateStore";
import { studyUser } from "renderer/store/reviewUtils/studyUser";
import { userStore } from "renderer/store/userStore";

const FadeInButton = styled(IconButton)`
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

export const StudyUserBtn = () => {
  const currentDateBySecond = dateStore((s) => s.currentDateBySecond);
  const cards = userStore((s) => s.userFlashcardList);
  const [showStudy, setShowStudy] = React.useState(false);

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
    <Tooltip title={showStudy ? "Study all!" : "All done!"}>
      <div>
        <FadeInButton size="small" onClick={studyUser} disabled={!showStudy}>
          <SchoolIcon />
        </FadeInButton>
      </div>
    </Tooltip>
  );
};
