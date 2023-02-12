import { Editor } from "slate";
import { SlateEditor } from "main/database/schemas/nodeSchema";

export const enableClozeNumber = (editor: SlateEditor, clozeNumber: number) => {
  Editor.addMark(editor, "clozeNumber", clozeNumber);
};

export const isClozeNumber = (editor: SlateEditor) => {
  const marks: any = Editor.marks(editor);
  let marksFormat;
  if (marks) {
    marksFormat = marks.clozeNumber;
  }
  return marks ? typeof marksFormat === "number" : false;
};
