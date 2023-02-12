import { Editor, Transforms, Element as SlateElement } from "slate";
import { SlateEditor, Marks } from "main/database/schemas/nodeSchema";

const HEADINGS = [
  "Heading 1",
  "Heading 2",
  "Heading 3",
  "Heading 4",
  "Heading 5",
  "Heading 6",
];

// MARKS
export const isMarkActive = (editor: SlateEditor, format: string) => {
  const marks: any = Editor.marks(editor);
  let marksFormat;
  if (marks) {
    marksFormat = marks[format];
  }
  return marks ? marksFormat === true : false;
};

export const toggleMark = (editor: SlateEditor, format: Marks) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const disableMark = (editor: SlateEditor, format: string) => {
  Editor.removeMark(editor, format);
};

export const enableMark = (editor: SlateEditor, format: string) => {
  Editor.addMark(editor, format, true);
};

export const isClozeNumber = (editor: SlateEditor) => {
  const marks: any = Editor.marks(editor);
  let marksFormat;
  if (marks) {
    marksFormat = marks.clozeNumber;
  }
  return marks ? typeof marksFormat === "number" : false;
};

export const Unwrapper = (editor: SlateEditor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) => {
      let returnValue = false;
      if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
        returnValue = HEADINGS.includes(n.blockType);
      }
      return returnValue;
    },
    split: true,
  });
};
