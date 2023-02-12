/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Slate } from "slate-react";
import { NodeEntry, Node, Text, BaseRange } from "slate";
import { SlateElement } from "main/database/schemas/nodeSchema";
import { slateOnChange } from "renderer/store/slateUtils/slateOnChange";
import { editorContainer } from "renderer/store/slateUtils/editorContainer";
import { noteStore } from "renderer/store/noteStore";
import { slateStore } from "renderer/store/slateStore";
import { resetAndSetSlateValue } from "renderer/store/slateUtils/resetAndSetSlateValue";
import { getNotesInvoker } from "renderer/ipc/notesInvoker";
import { HoveringToolbar } from "./hovering_toolbar/HoveringToolbar";
import { RenderElement } from "./renderer/ElementRenderer";
import { LeafRenderer } from "./renderer/LeafRenderer";
import { StyledEditable } from "./styles/StyledEditable";
import { hotkeys } from "./hotkeys";
import { SlateSearchDialog } from "../hotkeys/hotkeysDialogs/slateSearchDialog/SlateSearchDialog";
import { slateLibraryChanges } from "./slateLibraryChanges";

slateLibraryChanges();

// export const findUrlsInText = (text: string) => {
//   const urlRegex =
//     // eslint-disable-next-line no-useless-escape
//     /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;

//   const matches = text.match(urlRegex);

//   return matches ? matches.map((m) => [m.trim(), text.indexOf(m.trim())]) : [];
// };

const clozeDecorator = ([node, path]: NodeEntry<Node>) => {
  const ranges: BaseRange[] = [];

  if (!Text.isText(node)) return [];
  const { text } = node;
  const minText = text.toLowerCase();
  const reg3 = /({{c\d::(?:.*?)(?:::[^:]+)?}})/g;
  const parts = minText.split(reg3);
  let offset = 0;
  parts.forEach((part, i) => {
    if (i % 2 !== 0) {
      const range = {
        anchor: { path, offset },
        focus: { path, offset: offset + part.length },
        highlight: true,
      } as unknown as BaseRange;
      ranges.push(range);
    }

    offset += part.length;
  });

  return ranges;
};

const searchDecorator = (
  [node, path]: NodeEntry<Node>,
  searchString: string
) => {
  const ranges: BaseRange[] = [];
  const minSearch = searchString.toLowerCase();

  if (!minSearch || !Text.isText(node) || minSearch.length < 2) return [];
  const { text } = node;
  const minText = text.toLowerCase();
  const parts = minText.split(searchString);
  let offset = 0;

  parts.forEach((part, i) => {
    if (i !== 0) {
      const range = {
        anchor: { path, offset: offset - minSearch.length },
        focus: { path, offset },
        highlight: true,
      } as unknown as BaseRange;
      ranges.push(range);
    }

    offset = offset + part.length + minSearch.length;
  });

  return ranges;
};

export const TextEditor = () => {
  const value = slateStore((s) => s.value);
  const searchString = slateStore((s) => s.searchString);
  const containerTop = slateStore((s) => s.containerTop);
  const note = noteStore((s) => s.note);
  const { editor } = editorContainer;

  React.useEffect(() => {
    const f = async () => {
      if (!note) return;
      const result = await getNotesInvoker([note.id]);
      if (result.error) return;
      const updateNote = result.data[0];
      const nodes = updateNote.data.nodes as SlateElement[];
      await resetAndSetSlateValue(nodes);
    };
    f();
    // Triggers not only when not changes but also when exiting reviews and sources
    // Which is why it is needed
  }, [note]);

  const renderElement = React.useCallback(
    (props) => <RenderElement {...props} editor={editor} />,
    [editor]
  );
  const renderLeaf = React.useCallback(
    (props) => <LeafRenderer {...props} editor={editor} />,
    [editor]
  );

  const handleEditableClick = () => {
    slateStore.setState({ popperClosed: true });
  };

  const handleEditableOnKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    hotkeys(event, editor);
  };

  const decorate = React.useCallback(
    ([node, path]: NodeEntry<Node>) => [
      ...clozeDecorator([node, path]),
      ...searchDecorator([node, path], searchString),
    ],
    [searchString]
  );

  if (!note) return null;
  if (!value) return null;
  return (
    <div
      style={{
        marginLeft: "16px",
        height: `calc(100vh - ${containerTop}px - 8px)`,
      }}
    >
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => slateOnChange(newValue as SlateElement[], note)}
      >
        <HoveringToolbar />
        <StyledEditable
          style={{
            maxHeight: `calc(100vh - ${containerTop}px - 8px)`,
            overflowWrap: "anywhere",
            paddingTop: "3px",
          }}
          decorate={decorate}
          onClick={handleEditableClick}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some text…"
          spellCheck
          onKeyDown={handleEditableOnKeyDown}
        />
      </Slate>
      <SlateSearchDialog />
    </div>
  );
};
