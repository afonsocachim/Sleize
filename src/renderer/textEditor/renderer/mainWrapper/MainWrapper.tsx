/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { isEmpty } from "lodash";
import { Transforms } from "slate";
import { ReactEditor, useSelected, useFocused } from "slate-react";
import { IconButton, Menu, Grid } from "@mui/material";
import { styled } from "@mui/system";
import ChevronRightIcon from "@mui/icons-material//ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material//KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { SlateElement, SlateEditor } from "main/database/schemas/nodeSchema";
import { noteStore } from "renderer/store/noteStore";
import { sToHMS } from "renderer/utils/sToHMS";
import { expandCollapseHeading } from "../../utils/expandCollapseHeading";
import { SourceDiv } from "./SourceDiv";
import { CleanInput } from "./CleanInput";
import { inputChange, resetSource } from "./mainWrapperUtils";

const Wrapper = styled("table")``;

export default function MainWrapper({
  element,
  isHeading,
  children,
  editor,
}: {
  element: SlateElement;
  isHeading: boolean;
  children: React.ReactNode;
  editor: SlateEditor;
}) {
  const isImage = element.blockType === "Image";
  const [ShowIcon, setShowIcon] = React.useState(false);
  const selected = useSelected();
  const focused = useFocused();

  const showSources = noteStore((s) => s.showSources);

  const mountedRef = React.useRef<boolean>(false);
  const handleHeadingButton = () => {
    const path = ReactEditor.findPath(editor, element);
    expandCollapseHeading(path, element, editor);
  };

  React.useEffect(() => {
    mountedRef.current = true;
  }, []);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const FinalInput = () => {
    const { source: s } = element;
    if (!s) return null;
    if (typeof s.page === "number")
      return (
        <span style={{ paddingLeft: 4 }}>
          <span>P.</span>
          <CleanInput
            type="number"
            min={0}
            max={9999}
            value={s.page}
            onChange={(e) => inputChange(e, element)}
          />
        </span>
      );
    if (typeof s.time === "number")
      return (
        <CleanInput
          type="time"
          min="00:00:00"
          max="23:59:59"
          step="1"
          value={sToHMS(s.time)}
          onChange={(e) => inputChange(e, element)}
        />
      );
    return null;
  };

  const isList = element.list;
  const addPadding = element.source?.color || element.blockType === "Image";
  const handleCollapseImage = () => {
    const path = ReactEditor.findPath(editor, element);
    if (element.blockType !== "Image") throw Error("No image");
    Transforms.setNodes(
      editor,
      { image: { ...element.image, isCollapsed: !element.image.isCollapsed } },
      { at: path }
    );
  };
  const validSelection = selected && focused;
  const imageSelect = isImage && validSelection;
  const imageBox = imageSelect
    ? "inset 0 0 0 3px #B4D5FF"
    : "inset 0 0 0 1px lightGray";
  const boxShadow = !isImage ? "white" : imageBox;

  return (
    <Wrapper
      id={element.id}
      onMouseEnter={() => setShowIcon(true)}
      onMouseLeave={() => setShowIcon(false)}
      // eslint-disable-next-line react/destructuring-assignment
      style={{
        paddingTop: addPadding ? 1 : 0,
        paddingBottom: addPadding ? 1 : 0,
        width: "100%",
      }}
      // prevents drag and drop due to unique ids in question nodes
      onDragStart={(e) => {
        e.stopPropagation();
        e.stopPropagation();
      }}
      onDrop={(e) => e.stopPropagation()}
    >
      <tr>
        <td
          contentEditable={false}
          style={{
            width: "30px",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: 0 }}>
            {isHeading && (
              <IconButton
                size="small"
                onClick={handleHeadingButton}
                style={{
                  visibility: ShowIcon ? "visible" : "hidden",
                  padding: 0,
                  margin: 0,
                  marginLeft: 5,
                }}
              >
                {element.nestedNodes.length > 0 ? (
                  <ChevronRightIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            )}
            {isImage && (
              <IconButton
                size="small"
                onClick={handleCollapseImage}
                style={{
                  visibility: ShowIcon ? "visible" : "hidden",
                  padding: 0,
                  margin: 0,
                  marginLeft: 5,
                }}
              >
                {element.image.isCollapsed ? (
                  <ChevronRightIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            )}
          </div>
        </td>
        <td
          style={{
            textAlign: "left",
            width: "calc(100% - 50px)",
          }}
        >
          <Grid
            container
            style={{
              paddingLeft: 4,
              backgroundColor: element?.source?.color || "",
              borderRadius: 4,
              boxShadow,
            }}
          >
            {isList && (
              <div
                contentEditable={false}
                style={{ width: 10, userSelect: "none", paddingLeft: 4 }}
              >
                {"•  "}
              </div>
            )}
            <div
              style={{
                width: "calc(100% - 10px)",
                paddingLeft: 4,
              }}
            >
              {children}
            </div>
          </Grid>
        </td>

        <td contentEditable={false} style={{ userSelect: "none", width: 25 }}>
          {showSources && element.source ? (
            <SourceDiv source={element.source} element={element} />
          ) : null}
        </td>
        <td
          contentEditable={false}
          style={{
            userSelect: "none",
            width: 25,
          }}
        >
          {showSources && !isEmpty(element.source) && (
            <>
              <IconButton
                onClick={handleClick}
                style={{
                  padding: 4,
                }}
              >
                <EditIcon style={{ height: 16, width: 16 }} />
              </IconButton>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <FinalInput />
                <IconButton
                  onClick={() => resetSource(element)}
                  style={{
                    padding: 4,
                  }}
                >
                  <DeleteIcon style={{ height: 16, width: 16 }} />
                </IconButton>
              </Menu>
            </>
          )}
        </td>
      </tr>
    </Wrapper>
  );
}
