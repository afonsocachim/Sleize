/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { styled } from "@mui/system";
import { userStore } from "renderer/store/userStore";
import { updateUserInvoker } from "renderer/ipc/userInvokers";
import { usePrevious } from "renderer/hooks/usePrevious";
import { Notebook } from "./Notebook";
import { libraryStore } from "./libraryStore";
import { onDragEnd } from "./libraryUtils/onDragEnd";

const Container = styled("div")`
  display: flex;
`;

export const Library = () => {
  const library = libraryStore((s) => s);
  const previousLibrary = usePrevious(library);

  React.useEffect(() => {
    const { user } = userStore.getState();
    if (!user) throw Error("No user");
    libraryStore.setState(user.library);
  }, []);

  React.useEffect(() => {
    const fn = async () => {
      const result = await updateUserInvoker({ library });
      if (result.error) {
        if (!previousLibrary) return;
        libraryStore.setState(previousLibrary);
      }
    };
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library]);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="notebook"
        >
          {(droppableProvided) => {
            return (
              <Container
                {...droppableProvided.droppableProps}
                ref={droppableProvided.innerRef}
              >
                {library.notebookOrder.map((columnId, index) => {
                  const column = library.notebooks[columnId];
                  const tasks = column.sectionIds.map(
                    (taskId) => library.sections[taskId]
                  );

                  return (
                    <Notebook
                      index={index}
                      key={column.id}
                      notebookObj={column}
                      notebookSections={tasks}
                    />
                  );
                })}
                {droppableProvided.placeholder}
              </Container>
            );
          }}
        </Droppable>
      </DragDropContext>
    </>
  );
};
