import React from "react";
import createStore from "zustand";
import {
  Dialog as MuiDialog,
  DialogContent,
  Grid,
  ListItemButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Note } from "main/database/schemas/noteSchema";
import { userStore } from "renderer/store/userStore";
import { sectionStore } from "renderer/store/sectionStore";
import { commandLineReset } from "renderer/store/resetStore";
import {
  toggleNoteSearch,
  dialogStore,
  resetDialogStore,
} from "renderer/hotkeys/dialogStore";
import { noteStore } from "renderer/store/noteStore";

const Dialog = styled(MuiDialog)`
  .MuiDialog-paper {
    width: 80vw;
    max-width: 80vw;
    height: 80vh;
    max-height: 80vh;
    background-color: rgba(255, 255, 255, 0.95);
  }
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0);
  }
`;

const RootGrid = styled(Grid)`
  width: calc(80vw - 40px);
  max-width: calc(80vw - 40px);
  height: calc(80vh - 40px);
  max-height: calc(80vh - 40px);
`;

const NoteContainer = styled(Grid)`
  overflow: scroll;
  height: calc(80vh - 40px - 65px);
  max-height: calc(80vh - 40px - 65px);

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

const NoteItem = styled(ListItemButton)`
  padding: 4px;
  border-radius: 4px;
`;

export const CleanInput = styled("input")`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 4px;
  width: calc(80vw - 40px);
  max-width: calc(80vw - 40px);
  height: calc(50px);
  max-height: calc(50px);
  &:focus {
    outline: none;
  }
  border: 0px;

  font-weight: 400;
  font-size: 1.5rem;
  line-height: 1.3;
  letter-spacing: -0.01562em;
`;

type SelectedStore = { selectedIndex: number; maxIndex: number };

const iStore: SelectedStore = { selectedIndex: 0, maxIndex: 0 };

const selectedStore = createStore<SelectedStore>(() => iStore);

const resetSelectedStore = () => selectedStore.setState(iStore);

const changeIndex = (n: number) => {
  if (n < 0) {
    selectedStore.setState({ selectedIndex: 0 });
    return;
  }
  const { maxIndex } = selectedStore.getState();
  if (n > maxIndex) {
    selectedStore.setState({ selectedIndex: maxIndex });
    return;
  }
  selectedStore.setState({ selectedIndex: n });
};

const decreaseIndex = () => {
  const { selectedIndex } = selectedStore.getState();
  changeIndex(selectedIndex - 1);
};

const increaseIndex = () => {
  const { selectedIndex } = selectedStore.getState();
  changeIndex(selectedIndex + 1);
};

const arrowListener = (event: KeyboardEvent) => {
  if (event.code === "ArrowUp") {
    decreaseIndex();
  } else if (event.code === "ArrowDown") {
    increaseIndex();
  }
};

export const NoteSearchDialog = () => {
  const [searchText, setSearchText] = React.useState("");
  const open = dialogStore((s) => s.currentDialog === "NOTE_SEARCH");
  const [noteDocumentList, setNoteDocumentList] = React.useState<Note[]>([]);
  const [noteList, setNoteList] = React.useState<Note[]>([]);
  const [cached, setCached] = React.useState<{ [id: string]: Note[] }>({});
  const selectedIndex = selectedStore((s) => s.selectedIndex);

  React.useEffect(() => {
    setCached({});
  }, [noteDocumentList]);

  React.useEffect(() => {
    const maxIndex = noteList.length - 1;
    selectedStore.setState({
      selectedIndex: 0,
      maxIndex,
    });
  }, [noteList]);

  React.useEffect(() => {
    if (open) {
      window.addEventListener("keydown", arrowListener);
      setNoteDocumentList(userStore.getState().noteDocumentList);
      setSearchText("");
      setCached({});
      resetSelectedStore();
      setNoteList([]);
    } else {
      window.removeEventListener("keydown", arrowListener);
      setNoteDocumentList([]);
      setSearchText("");
      setCached({});
      resetSelectedStore();
      setNoteList([]);
    }
  }, [open]);

  const handleChooseNote = (note: Note) => {
    const { user } = userStore.getState();
    if (!user) throw Error("no user");
    const { sections } = user.library;
    const getSectionAndChoose = (n: Note) => {
      if (sections[n.parent]) {
        commandLineReset();
        sectionStore.setState({ section: sections[n.parent] });
        resetDialogStore();
      } else {
        const parent = noteDocumentList.find((p) => p.id === n.parent);
        if (!parent) throw Error("no parent");
        getSectionAndChoose(parent);
      }
    };
    getSectionAndChoose(note);
    noteStore.setState({ note });
  };

  React.useEffect(() => {
    window.addEventListener("keydown", toggleNoteSearch);
    return () => {
      window.removeEventListener("keydown", toggleNoteSearch);
    };
  }, []);

  React.useEffect(() => {
    const filterAndCache = () => {
      const min = searchText.toLowerCase();
      if (!min) {
        setNoteList(noteDocumentList.slice(0, 100));
        return;
      }
      if (cached[min]) {
        setNoteList(cached[min]);
        return;
      }
      const filtered = noteDocumentList.filter((n) =>
        n.text.toLowerCase().includes(min)
      );
      setCached({ ...cached, [min]: filtered });
      setNoteList(filtered);
    };
    filterAndCache();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteDocumentList, searchText]);

  return (
    <Dialog
      open={open}
      onClose={() => resetDialogStore()}
      onKeyDown={(e) => {
        if (e.code === "Enter") {
          e.preventDefault();
          if (noteList.length > 0) handleChooseNote(noteList[selectedIndex]);
        }
        if (e.code === "Escape") {
          e.preventDefault();
          resetDialogStore();
        }
      }}
    >
      <DialogContent>
        <RootGrid container direction="column" justifyContent="space-between">
          <CleanInput
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            autoFocus
            placeholder="Search notes"
          />
          <NoteContainer>
            {noteList.map((n, index) => (
              <NoteItem
                key={n.id}
                onClick={() => handleChooseNote(n)}
                style={{
                  backgroundColor:
                    index === selectedIndex ? "rgba(0, 0, 0, 0.1)" : "",
                }}
              >
                - {n.text}
              </NoteItem>
            ))}
            {noteList.length === 0 && <NoteItem disabled>No notes</NoteItem>}
          </NoteContainer>
        </RootGrid>
      </DialogContent>
    </Dialog>
  );
};
