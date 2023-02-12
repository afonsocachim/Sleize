import React from "react";
import { Typography, Grid } from "@mui/material";
import { styled } from "@mui/system";
import { sectionStore } from "renderer/store/sectionStore";
import { CreateNoteBtn } from "./CreateNoteBtn";
import { StudySectionBtn } from "./StudySectionBtn";

const MyTypography = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(300px - 80px);
  font-weight: 500;
`;

const FadeInDiv = styled("div")`
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

export const SectionSubheading = () => {
  const section = sectionStore((s) => s.section);
  const [showStudy, setShowStudy] = React.useState(false);

  if (!section) return null;

  return (
    <Grid
      style={{ width: 300 - 16, height: 30 }}
      container
      alignItems="center"
      onMouseEnter={() => setShowStudy(true)}
      onMouseLeave={() => setShowStudy(false)}
    >
      <MyTypography>{section.title}</MyTypography>
      {showStudy && (
        <FadeInDiv>
          <CreateNoteBtn />
        </FadeInDiv>
      )}
      {showStudy && (
        <FadeInDiv>
          <StudySectionBtn />
        </FadeInDiv>
      )}
    </Grid>
  );
};
