import { createEditor } from "slate";
import { withReact } from "slate-react";
import { withHistory } from "slate-history";
import { specialPaste } from "renderer/textEditor/middleware/specialPaste";

export const editorContainer = {
  editor: specialPaste(withHistory(withReact(createEditor()))),
};
