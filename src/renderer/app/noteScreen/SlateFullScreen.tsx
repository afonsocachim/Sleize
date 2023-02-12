import { styled } from "@mui/system";
import { TextEditor } from "renderer/textEditor/TextEditor";
import { NoteScreenHeader } from "./NoteScreenHeader";

const MaxHeightDiv = styled("div")`
  height: 100vh;
  max-height: 100vh;
  /* Needs its own background color due to pdf overflow with more than 100% zoom */
  background-color: white;
`;

export const SlateFullScreen = () => {
  return (
    <MaxHeightDiv>
      <NoteScreenHeader />
      <TextEditor />
    </MaxHeightDiv>
  );
};
