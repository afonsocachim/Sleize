import { Editable } from "slate-react";
import { styled } from "@mui/system";

export const StyledEditable = styled(Editable)`
  overflow-y: scroll;
  overflow-x: hidden;
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
