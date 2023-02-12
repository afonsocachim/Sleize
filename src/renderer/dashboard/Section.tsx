/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { styled } from "@mui/system";
import { Draggable } from "react-beautiful-dnd";
import { Grid, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { SectionObj, NotebookObj } from "main/database/schemas/librarySchema";
import { ConfirmDialog } from "renderer/components/dialogs/ConfirmDialog";
import { SimpleDialog } from "renderer/components/dialogs/SimpleDialog";
import { sectionStore } from "renderer/store/sectionStore";
import { deleteSection } from "./libraryUtils/deleteSection";
import { editSectionTitle } from "./libraryUtils/editSectionTitle";

const Container = styled(Grid)`
  border-radius: 3px;
  height: calc(1em + 20px);
  padding-left: 8px;
  &:hover {
    background-color: rgb(0, 0, 0, 0.1);
  }
`;

const FadeInButton = styled(IconButton)`
  animation: fadein 1s;
  padding: 0;

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const Section = ({
  sectionObj,
  index,
  notebookObj,
}: {
  sectionObj: SectionObj;
  notebookObj: NotebookObj;
  index: number;
}) => {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [showButtons, setShowButtons] = React.useState(false);

  const handleEdit = async (s: string) => {
    editSectionTitle(s, sectionObj);
    if (s.length === 0) return false;
    return true;
  };
  return (
    <Draggable draggableId={sectionObj.id} index={index}>
      {(provided) => {
        return (
          <Container
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            container
            justifyContent="space-between"
            alignItems="center"
            onMouseOver={() => setShowButtons(true)}
            onMouseLeave={() => setShowButtons(false)}
            onClick={() => sectionStore.setState({ section: sectionObj })}
          >
            <div
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                width: 170,
              }}
            >
              {sectionObj.title}
            </div>
            {showButtons && (
              <div>
                <Tooltip title="Edit section">
                  <FadeInButton size="small" onClick={() => setOpenEdit(true)}>
                    <EditIcon />
                  </FadeInButton>
                </Tooltip>
                <SimpleDialog
                  open={openEdit}
                  setOpen={setOpenEdit}
                  stringName="Edit section"
                  buttonText="Edit"
                  action={handleEdit}
                  string={sectionObj.title}
                />
                <Tooltip title="Delete section">
                  <FadeInButton
                    size="small"
                    onClick={() => setOpenDelete(true)}
                  >
                    <DeleteIcon />
                  </FadeInButton>
                </Tooltip>
                <ConfirmDialog
                  open={openDelete}
                  setOpen={setOpenDelete}
                  buttonText="Delete"
                  action={() => deleteSection(index, sectionObj, notebookObj)}
                  string="Delete Section?"
                />
              </div>
            )}
          </Container>
        );
      }}
    </Draggable>
  );
};
