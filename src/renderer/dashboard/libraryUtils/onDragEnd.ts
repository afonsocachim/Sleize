import { DropResult } from "react-beautiful-dnd";
import { LibraryState, NotebookObj } from "main/database/schemas/librarySchema";
import { libraryStore } from "../libraryStore";

export const onDragEnd = (result: DropResult) => {
  const { destination, source, draggableId, type } = result;
  const library = libraryStore.getState();

  if (!destination) {
    // dragged outside
    return;
  }

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    // same location
    return;
  }

  if (type === "notebook") {
    const newColumnOrder = [...library.notebookOrder];
    newColumnOrder.splice(source.index, 1);
    newColumnOrder.splice(destination.index, 0, draggableId);

    const newState: LibraryState = {
      ...library,
      notebookOrder: newColumnOrder,
    };
    libraryStore.setState(newState);
    return;
  }

  const start = library.notebooks[source.droppableId];
  const finish = library.notebooks[destination.droppableId];

  if (start === finish) {
    const newTaskIds = [...start.sectionIds]; // create new array to avoid mutations
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn: NotebookObj = {
      ...start,
      sectionIds: newTaskIds,
    };

    const newState: LibraryState = {
      ...library,
      notebooks: {
        ...library.notebooks,
        [newColumn.id]: newColumn,
      },
    };

    libraryStore.setState(newState);
    return;
  }

  // Moving from one list to another
  const startTaskIds = [...start.sectionIds];
  startTaskIds.splice(source.index, 1);
  const newStart: NotebookObj = {
    ...start,
    sectionIds: startTaskIds,
  };

  const finishTaskIds = [...finish.sectionIds];
  finishTaskIds.splice(destination.index, 0, draggableId);
  const newFinish: NotebookObj = {
    ...finish,
    sectionIds: finishTaskIds,
  };

  const newState: LibraryState = {
    ...library,
    notebooks: {
      ...library.notebooks,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    },
  };

  libraryStore.setState(newState);
};
