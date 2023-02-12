import React from "react";
import { Grid, IconButton } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { styled } from "@mui/system";
import { slateStore } from "renderer/store/slateStore";

const mySetRanges = () => {
  const highlights = Array.from(document.querySelectorAll("#SlateDecorator"));
  slateStore.setState({ findsArray: highlights });
};

const CleanInput = styled("input")`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 4px;
  width: 300px;
  max-width: 300px;
  height: 30px;
  max-height: 30px;
  &:focus {
    outline: none;
  }
  border: 0px;

  font-weight: 400;
  font-size: 1rem;
  line-height: 1.3;
  letter-spacing: -0.01562em;
`;

export const SlateSearchContent = () => {
  const searchString = slateStore((s) => s.searchString);
  const findsArray = slateStore((s) => s.findsArray);
  const [currentNumber, setCurrentNumber] = React.useState(0);

  React.useEffect(() => {
    if (findsArray.length > 0) {
      setCurrentNumber(1);
      return;
    }
    setCurrentNumber(0);
  }, [findsArray]);

  React.useEffect(() => {
    mySetRanges();
  }, [searchString]);

  const handleHighlightBtn = (n: number) => {
    if (currentNumber === 0) return;
    let newNumber = currentNumber + n;
    if (newNumber > findsArray.length) newNumber = 1;
    if (newNumber < 1) newNumber = findsArray.length;
    setCurrentNumber(newNumber);
    const domEl = findsArray[newNumber - 1];
    domEl.scrollIntoView();
  };

  const handleSearchChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" || e.code === "ArrowDown") {
      handleHighlightBtn(1);
    }
    if (e.code === "ArrowUp") {
      handleHighlightBtn(-1);
    }
  };

  return (
    <Grid container alignItems="center">
      <CleanInput
        value={searchString}
        onChange={(e) => slateStore.setState({ searchString: e.target.value })}
        onKeyDown={handleSearchChange}
        autoFocus
      />
      <IconButton
        disabled={!currentNumber}
        size="small"
        onClick={() => handleHighlightBtn(-1)}
      >
        <ArrowLeftIcon />
      </IconButton>
      {currentNumber}/{findsArray.length}
      <IconButton
        disabled={!currentNumber}
        size="small"
        onClick={() => handleHighlightBtn(1)}
      >
        <ArrowRightIcon />
      </IconButton>
    </Grid>
  );
};
