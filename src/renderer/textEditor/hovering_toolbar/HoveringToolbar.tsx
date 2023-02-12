/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { ReactEditor, useSlate } from "slate-react";
import { Editor, Range } from "slate";
import {
  ButtonGroup,
  Button,
  MenuItem,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuList,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material//ArrowDropDown";
import { styled } from "@mui/system";
import {
  BlockTypes,
  blockTypesArray,
  Marks,
  marksArray,
  SlateElement,
} from "main/database/schemas/nodeSchema";
import { slateStore } from "renderer/store/slateStore";
import { ToolbarContainer } from "./ToolbarContainer";
import { Portal } from "./Portal";
import { toggleMark } from "../utils/helperFunctions";
import { toggleBlockWithSelection } from "../utils/toggleBlockWithSelection";
import { isBlockActive } from "../utils/isBlockActive";
import { toggleCloze } from "../hotkeys/toggleCloze";

export const MyMenuList = styled(MenuList)`
  max-height: 200px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 14px;
  }

  ::-webkit-scrollbar-thumb {
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 9999px;
    background-color: #aaaaaa;
  }
`;

export const HoveringToolbar = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const editor = useSlate();
  const popperClosed = slateStore((s) => s.popperClosed);
  const offsetLeft = slateStore((s) => s.containerOffsetLeft);
  const startIndex = editor.selection?.anchor.path[0];

  const [allowCloze, setAllowCloze] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) return;

    if (
      popperClosed &&
      (!selection ||
        !ReactEditor.isFocused(editor) ||
        Range.isCollapsed(selection) ||
        Editor.string(editor, selection) === "")
    ) {
      el.removeAttribute("style");
      el.style.display = "none";
      return;
    }
    if (!offsetLeft) return;

    const domSelection = window.getSelection();
    if (!domSelection) throw Error("No domSelection");
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    const calcLeft =
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2;
    const minLeft = offsetLeft + 33;
    const left = calcLeft < minLeft ? minLeft : calcLeft;
    el.style.opacity = "1";
    el.style.display = "block";
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${left}px`;

    console.log("startIndex", startIndex);

    if (typeof startIndex !== "number") {
      setAllowCloze(false);
      return;
    }
    const isInline = startIndex === editor.selection?.focus.path[0];
    console.log("isInline", isInline);
    const value = [...editor.children] as SlateElement[];
    console.log("value[startIndex].blockType", value[startIndex].blockType);
    if (!isInline) {
      setAllowCloze(false);
      return;
    }
    if (value[startIndex].blockType !== "Question") {
      setAllowCloze(false);
      return;
    }
    setAllowCloze(true);
  });

  const handleMark = (mark: Marks) => {
    toggleMark(editor, mark);
  };

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement | null>(null);

  const handleMenuItemClick = (format: BlockTypes) => {
    slateStore.setState({ popperClosed: true });
    toggleBlockWithSelection(editor, format);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }

    setOpen(false);
  };

  return (
    <Portal>
      <ToolbarContainer ref={ref}>
        <ButtonGroup>
          {marksArray.map((mark) => (
            <Button onClick={() => handleMark(mark)} size="small" key={mark}>
              {mark.slice(0, 1)}
            </Button>
          ))}
          {allowCloze && (
            <Button onClick={() => toggleCloze(editor, true)} size="small">
              C
            </Button>
          )}
          <Button
            ref={anchorRef}
            color="primary"
            size="small"
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={() => {
              slateStore.setState({ popperClosed: false });
              handleToggle();
            }}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MyMenuList id="split-button-menu">
                    {blockTypesArray.map((format, index) => (
                      <MenuItem
                        key={index}
                        selected={isBlockActive(editor, format)}
                        onClick={() => {
                          handleMenuItemClick(format);
                        }}
                      >
                        {format}
                      </MenuItem>
                    ))}
                  </MyMenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </ToolbarContainer>
    </Portal>
  );
};
