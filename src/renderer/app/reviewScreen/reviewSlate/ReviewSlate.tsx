/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { isEmpty } from "lodash";
import { createEditor } from "slate";
import { Slate, withReact, Editable } from "slate-react";
import { SlateImage, SlateQuestion } from "main/database/schemas/nodeSchema";
import { Flashcard } from "main/database/schemas/flashcardSchema";
import { Note } from "main/database/schemas/noteSchema";
import { reviewStore } from "renderer/store/reviewStore";
import { LeafRenderer } from "./LeafRenderer";
import { ElementRenderer } from "./ElementRenderer";

export const ReviewSlate = ({ card }: { card: Flashcard }) => {
  const editor = React.useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = React.useState<Array<SlateQuestion | SlateImage>>(
    []
  );

  React.useEffect(() => {
    const { reviewNotes } = reviewStore.getState();
    const note = reviewNotes[card.noteId] as Note | undefined;
    if (!note) throw Error("No note");
    const node = note.data.nodes.find((n) => n.id === card.nodeId);
    if (!node) throw Error("No node");
    const validNode =
      node.blockType === "Question" || node.blockType === "Image";
    if (!validNode) throw Error("Invalid node");
    const reviewNode = node as SlateImage | SlateQuestion;
    editor.children = [reviewNode];
    editor.onChange();
    setValue([reviewNode]);
    editor.selection = null;
    editor.history = {
      undos: [],
      redos: [],
    };
  }, [editor, card]);

  const renderLeaf = React.useCallback(
    (leafProps) => <LeafRenderer {...leafProps} />,
    []
  );
  const renderElement = React.useCallback(
    (elProps) => <ElementRenderer {...elProps} />,
    []
  );
  if (isEmpty(value)) return null;
  return (
    <Slate editor={editor} value={value} onChange={() => {}}>
      <Editable
        readOnly
        renderLeaf={renderLeaf}
        renderElement={renderElement}
      />
    </Slate>
  );
};
