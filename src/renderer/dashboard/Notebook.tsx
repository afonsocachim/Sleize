/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { styled } from "@mui/system";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Card, Grid, IconButton, Typography, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { NotebookObj, SectionObj } from "main/database/schemas/librarySchema";
import { colorArray } from "renderer/utils/colors";
import { SimpleDialog } from "renderer/components/dialogs/SimpleDialog";
import { ConfirmDialog } from "renderer/components/dialogs/ConfirmDialog";
import { deleteNotebook } from "./libraryUtils/deleteNotebook";
import { createSection } from "./libraryUtils/createSection";
import { editNotebookTitle } from "./libraryUtils/editNotebookTitle";
import { Section } from "./Section";
import { StudyNotebookBtn } from "./StudyNotebookBtn";

const Container = styled(Card)`
  margin: 8px 4px;
  background-color: ${(props) => props.color};
`;

const FadeInButton = styled(IconButton)`
  padding: 0;
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

const BtnGrid = styled("div")`
  display: flex;
  align-items: center;
  height: 100%;
`;

const Title = styled(Typography)`
  text-overflow: ellipsis;
  width: 160px;
  white-space: nowrap;
  overflow: hidden;
  font-weight: bold;
  height: 34px;
`;

const MainGrid = styled("div")`
  height: calc(100vh - 20vh - 40px - 250px);
  overflow: scroll;
  ::-webkit-scrollbar {
    width: 8px;
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

export const Notebook = ({
  notebookObj,
  notebookSections,
  index,
}: {
  notebookObj: NotebookObj;
  notebookSections: SectionObj[];
  index: number;
}) => {
  const [showHeadingBtns, setShowHeadingBtns] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const [openCreate, setOpenCreate] = React.useState(false);
  const [createString, setCreateString] = React.useState("");

  const handleEditNotebook = async (s: string) => {
    editNotebookTitle(s, notebookObj);
    if (s.length === 0) return false;
    return true;
  };

  const handleCreateSection = async (s: string) => {
    createSection(s, notebookObj);
    if (s.length === 0) return false;
    return true;
  };

  return (
    <Draggable draggableId={notebookObj.id} index={index}>
      {(draggableProvided) => {
        return (
          <Container
            color={colorArray[index % 6].hex}
            {...draggableProvided.draggableProps}
            ref={draggableProvided.innerRef}
          >
            <Grid
              container
              direction="column"
              justifyContent="flex-start"
              style={{ width: 250 }}
            >
              <Grid
                {...draggableProvided.dragHandleProps}
                container
                alignItems="center"
              >
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  onMouseOver={() => setShowHeadingBtns(true)}
                  onMouseLeave={() => setShowHeadingBtns(false)}
                  style={{ padding: 8 }}
                >
                  <Title>{notebookObj.title}</Title>
                  {showHeadingBtns && (
                    <BtnGrid>
                      <Tooltip title="Edit notebook">
                        <FadeInButton
                          size="small"
                          onClick={() => setOpenEdit(true)}
                        >
                          <EditIcon />
                        </FadeInButton>
                      </Tooltip>
                      <SimpleDialog
                        open={openEdit}
                        setOpen={setOpenEdit}
                        stringName="Edit Notebook"
                        buttonText="Edit"
                        action={handleEditNotebook}
                        string={notebookObj.title}
                      />
                      <Tooltip title="Delete notebook">
                        <FadeInButton
                          size="small"
                          onClick={() => setOpenDelete(true)}
                        >
                          <DeleteIcon />
                        </FadeInButton>
                      </Tooltip>
                      <StudyNotebookBtn notebookObj={notebookObj} />
                      <ConfirmDialog
                        open={openDelete}
                        setOpen={setOpenDelete}
                        buttonText="Delete"
                        action={() => deleteNotebook(index, notebookObj)}
                        string="Delete notebook?"
                      />
                    </BtnGrid>
                  )}
                </Grid>
                <Droppable droppableId={notebookObj.id} type="section">
                  {(droppableProvided) => (
                    <MainGrid>
                      <Grid
                        {...droppableProvided.droppableProps}
                        container
                        direction="column"
                        justifyContent="flex-start"
                        style={{
                          width: 235,
                          minHeight: 200,
                          paddingLeft: 8,
                        }}
                        ref={droppableProvided.innerRef}
                      >
                        {notebookSections.map((task, i) => (
                          <Section
                            index={i}
                            key={task.id}
                            sectionObj={task}
                            notebookObj={notebookObj}
                          />
                        ))}
                        {droppableProvided.placeholder}
                      </Grid>
                    </MainGrid>
                  )}
                </Droppable>
              </Grid>
              <Grid container justifyContent="flex-end" style={{ padding: 8 }}>
                <div>
                  <Tooltip title="Add section">
                    <IconButton
                      type="button"
                      onClick={() => setOpenCreate(true)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                  <SimpleDialog
                    open={openCreate}
                    setOpen={setOpenCreate}
                    stringName="Create Section"
                    buttonText="Create"
                    action={handleCreateSection}
                    string={""}
                  />
                </div>
              </Grid>
            </Grid>
          </Container>
        );
      }}
    </Draggable>
  );
};
