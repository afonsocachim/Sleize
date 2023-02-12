import React from "react";
import { CircularProgress, Box } from "@mui/material";
import { styled } from "@mui/system";

const StyledBox = styled(Box)`
  display: flex;
  margin: 100px auto;
  width: 40px;
  height: 40px;
  position: relative;
`;

export const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <StyledBox>
        <CircularProgress />
      </StyledBox>
    </div>
  );
};
