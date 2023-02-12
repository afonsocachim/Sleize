import React from "react";
import { styled } from "@mui/system";
import { Typography, Grid, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HelpIcon from "@mui/icons-material/Help";
import CancelIcon from "@mui/icons-material/Cancel";
import ReactMarkdown from "react-markdown";
import note from "renderer/assets/note.png";
import { createNotebook } from "renderer/dashboard/libraryUtils/createNotebook";
import { SimpleDialog } from "renderer/components/dialogs/SimpleDialog";
import { Library } from "renderer/dashboard/Library";
import { drawerStore } from "renderer/store/drawerStore";
import { dashboardStore } from "renderer/store/dashboardStore";
import { userStore } from "renderer/store/userStore";
import { OpenDrawerBtn } from "../app/layout/OpenDrawerBtn";
import { LogoutBtn } from "./LogoutBtn";
import { ProfileBtn } from "./ProfileBtn";
import { tutorial } from "./tutorial";
import { StudyUserBtn } from "./StudyUserBtn";

const TextGrid = styled(Grid)(`
  flex-grow: 1;
`);

const ButtonGrid = styled(Grid)(`
  padding-top: 8px;
  height: 40px;
`);

const NotebookGrid = styled(Grid)(`
  padding: 24px;
`);

const NotebookTitleGrid = styled(Grid)(`
  padding-left: 8px;
  height:40px;
`);

const MainGrid = styled(Grid)`
  height: calc(100vh - 20vh - 40px - 100px);
  overflow: scroll;
  ::-webkit-scrollbar {
    width: 14px;
  }

  ::-webkit-scrollbar-thumb:hover {
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 9999px;
    background-color: #aaaaaa;
  }
  ::-webkit-scrollbar-corner {
    background: rgba(0, 0, 0, 0);
  }
`;

const TutorialDiv = styled("div")`
  p {
    padding-inline-start: 20px;
  }
  ul {
    list-style-type: circle;
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 60px;
  }
  padding: 8px 32px;
  margin-top: 8px;
  height: calc(100vh - 48px);
  overflow: scroll;
  ::-webkit-scrollbar {
    width: 14px;
  }

  ::-webkit-scrollbar-thumb {
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 9999px;
    background-color: #aaaaaa;
  }
  ::-webkit-scrollbar-corner {
    background: rgba(0, 0, 0, 0);
  }
`;

export const Dashboard = () => {
  const username = userStore((s) => s.user && s.user.username);
  const [open, setOpen] = React.useState(false);
  const showTutorial = dashboardStore((s) => s.showTutorial);
  const [showStudyAll, setShowStudyAll] = React.useState(false);
  const isDrawerOpen = drawerStore((s) => s.isDrawerOpen);

  const handleCreateNotebook = async (s: string) => {
    createNotebook(s);
    if (s.length === 0) return false;
    return true;
  };

  const width = isDrawerOpen
    ? "calc(100vw - 300px - 64px)"
    : "calc(100vw - 64px)";

  if (!username) return null;

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      style={{ height: "100vh", backgroundColor: "#f7f7f7", minWidth: 600 }}
    >
      <ButtonGrid container justifyContent="space-between">
        <OpenDrawerBtn />
        <Grid>
          <ProfileBtn />
          <LogoutBtn />
          {!showTutorial && (
            <Tooltip title="Help">
              <IconButton
                onClick={() => dashboardStore.setState({ showTutorial: true })}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
          )}
          {showTutorial && (
            <IconButton
              onClick={() => dashboardStore.setState({ showTutorial: false })}
            >
              <CancelIcon />
            </IconButton>
          )}
        </Grid>
      </ButtonGrid>
      {!showTutorial && (
        <TextGrid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: "20vh" }}
          >
            <Typography variant="h1" style={{ paddingRight: 16 }}>
              Welcome Back!
            </Typography>
            <img src={note} alt="" style={{ height: "20vh" }} />
          </Grid>
          <NotebookGrid container>
            <NotebookTitleGrid
              container
              alignItems="center"
              onMouseEnter={() => setShowStudyAll(true)}
              onMouseLeave={() => setShowStudyAll(false)}
            >
              <Typography variant="h2">Notebooks</Typography>

              <Grid item style={{ width: 80 }} container alignItems="center">
                <Tooltip title="Add notebook">
                  <Grid alignItems="center">
                    <IconButton size="small" onClick={() => setOpen(true)}>
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Tooltip>
                {showStudyAll && <StudyUserBtn />}
              </Grid>
            </NotebookTitleGrid>
            <MainGrid container style={{ width }}>
              <Library />
              <SimpleDialog
                open={open}
                setOpen={setOpen}
                stringName="Create Notebook"
                buttonText="Create"
                action={handleCreateNotebook}
                string=""
              />
            </MainGrid>
          </NotebookGrid>
        </TextGrid>
      )}
      {showTutorial && (
        <TutorialDiv>
          <ReactMarkdown>{tutorial}</ReactMarkdown>
        </TutorialDiv>
      )}
    </Grid>
  );
};
