// INTERNAL
import { SlateEditor } from "main/database/schemas/nodeSchema";
import { toggleClozeHotkey } from "./toggleClozeHotkey";
import { toggleMarkHotkey } from "./toggleMarkHotkey";
import { shiftEnterPress } from "./shiftEnterPress";
import { toggleQuestionBlock } from "./toggleQuestionBlock";
import { toggleHeadingHotkey } from "./toggleHeadingHotkey";
import { toggleListHotkey } from "./toggleListHotkey";
import { toggleClozeEqual } from "./toggleClozeEqual";
import { specialMove } from "./specialMove";
import { simplePaste } from "./simplePaste";
import { enterPress } from "./enterPress";
import { backspaceHotkey } from "./backspaceListHotkey";
import { deleteHotkey } from "./deleteHotkey";
import { downRightArrowImage } from "./downRightArrowImage";
import { selectAll } from "./selectAll";

export const hotkeys = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  selectAll(event, editor);
  downRightArrowImage(event, editor);
  deleteHotkey(event, editor);
  backspaceHotkey(event, editor);
  enterPress(event, editor);
  toggleListHotkey(event, editor);
  toggleMarkHotkey(event, editor);
  shiftEnterPress(event, editor);
  toggleHeadingHotkey(event, editor);
  toggleClozeHotkey(event, editor);
  toggleClozeEqual(event, editor);
  toggleQuestionBlock(event, editor);
  specialMove(event, editor);
  simplePaste(event, editor);
};
