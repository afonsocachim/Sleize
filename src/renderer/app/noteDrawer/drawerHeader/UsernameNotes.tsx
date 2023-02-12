import { Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { userStore } from "renderer/store/userStore";

const MyTypography = styled(Typography)(
  ({ theme }) => `
  color: ${theme.palette.secondary.dark};
`
);

export const UsernameNotes = () => {
  const user = userStore((s) => s.user);
  const userFlashcardList = userStore((s) => s.userFlashcardList);
  if (!user) throw Error("No user");
  const txt = `${user.username}'s notes`;

  return (
    <>
      {userFlashcardList.length === 0 ? (
        <Tooltip placement="right" title="All cards done today!">
          <MyTypography variant="h2">{txt}</MyTypography>
        </Tooltip>
      ) : null}
      {userFlashcardList.length !== 0 ? (
        <Tooltip
          placement="right"
          title={
            userFlashcardList.length === 1
              ? `${userFlashcardList.length} more card today`
              : `${userFlashcardList.length} more cards today`
          }
        >
          <MyTypography variant="h2">{txt}</MyTypography>
        </Tooltip>
      ) : null}
    </>
  );
};
