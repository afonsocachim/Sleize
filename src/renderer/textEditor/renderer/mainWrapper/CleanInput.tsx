import { styled } from "@mui/system";

export const CleanInput = styled("input")`
  &:focus {
    outline: none;
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  border: 0px;
`;
