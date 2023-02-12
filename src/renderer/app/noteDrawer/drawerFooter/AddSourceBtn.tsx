import React from "react";
import { Tooltip, IconButton, Menu, Grid } from "@mui/material";
import FilePresentRoundedIcon from "@mui/icons-material/FilePresentRounded";
import { styled } from "@mui/system";
import { AddVideoBtn } from "./AddVideoBtn";
import { OnlineVideoBtn } from "./OnlineVideoBtn";
import { OnlineArticleBtn } from "./OnlineArticleBtn";
import { AddPdfBtn } from "./AddPdfBtn";

const MyMenu = styled(Menu)`
  .MuiMenu-root {
    padding: 0px;
  }

  .MuiMenu-paper {
    background-color: rgb(255, 255, 255, 0.8);
  }
  .MuiList-root {
    padding: 0px;
  }
`;

export const AddSourceBtn = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Tooltip title="Add source">
        <IconButton onClick={handleClick}>
          <FilePresentRoundedIcon />
        </IconButton>
      </Tooltip>
      <MyMenu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Grid container onClick={() => setAnchorEl(null)}>
          <OnlineArticleBtn />
          <AddPdfBtn />
          <AddVideoBtn />
          <OnlineVideoBtn />
        </Grid>
      </MyMenu>
    </div>
  );
};
