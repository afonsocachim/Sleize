/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { ReactEditor } from "slate-react";
import { IconButton, Tooltip } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import { SlateAttributes, SlateImage } from "main/database/schemas/nodeSchema";
import { svgStore } from "renderer/store/svgStore";
import { SimpleDialog } from "renderer/components/dialogs/SimpleDialog";
import { editorContainer } from "renderer/store/slateUtils/editorContainer";
import { Transforms } from "slate";

export const ImageRenderer = ({
  attributes,
  children,
  element,
}: {
  element: SlateImage;
  children: React.ReactNode;
  attributes: SlateAttributes;
}) => {
  const [src, setSrc] = React.useState("");

  React.useEffect(() => {
    const { src: s } = element.image;
    if (s) setSrc(s);
  }, [element.image]);

  const [showButton, setShowButton] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleEditCaption = async (s: string) => {
    const { editor } = editorContainer;
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(
      editor,
      { image: { ...element.image, imageText: s } },
      { at: path }
    );
    return true;
  };

  const hasImageText = Boolean(element.image.imageText);

  return (
    <div
      {...attributes}
      style={{
        padding: "4px 4px 4px 4px",
      }}
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
    >
      {hasImageText && (
        <div
          contentEditable={false}
          style={{
            padding: "0px 1px",
            borderBottom: "1px solid lightGray",
            fontStyle: "italic",
          }}
        >
          Figure - {element.image.imageText}
        </div>
      )}
      {!hasImageText && element.image.isCollapsed && (
        <div
          contentEditable={false}
          style={{
            padding: "0px 4px",
            borderBottom: "1px solid lightGray",
            fontStyle: "italic",
          }}
        >
          Untitled image
        </div>
      )}
      <div
        style={{
          fontStyle: "italic",
          backgroundColor: "white",
        }}
        onDrop={(e) => e.preventDefault()}
      >
        {children}
      </div>
      {!element.image.isCollapsed && (
        <div>
          <div
            contentEditable={false}
            style={{
              position: "relative",
              userSelect: "none",
            }}
          >
            <div>
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
              {showButton && (
                <Tooltip title="Image occlusion">
                  <IconButton
                    size="small"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      zIndex: 2,
                      opacity: 0.95,
                      backgroundColor: "white",
                    }}
                    onClick={() =>
                      svgStore.setState({
                        svgSrc: src,
                        initialSvgObjects: element.image.svgObjects,
                        slateImage: element,
                      })
                    }
                  >
                    <ImageIcon />
                  </IconButton>
                </Tooltip>
              )}
              {showButton && (
                <Tooltip
                  title={
                    element.image.imageText ? "Change caption" : "Add caption"
                  }
                >
                  <IconButton
                    size="small"
                    style={{
                      position: "absolute",
                      left: 40,
                      top: 0,
                      zIndex: 2,
                      opacity: 0.95,
                      backgroundColor: "white",
                    }}
                    onClick={() => setOpen(true)}
                  >
                    <TextFieldsIcon />
                    <SimpleDialog
                      open={open}
                      setOpen={setOpen}
                      stringName="Edit image"
                      buttonText="Edit"
                      action={handleEditCaption}
                      string={element.image.imageText}
                    />
                  </IconButton>
                </Tooltip>
              )}
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
              <img
                src={src}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  display: "block",
                  maxWidth: "100%",
                }}
                alt=""
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div contentEditable={false} style={{ userSelect: "none" }}>
            <div
              style={{
                visibility: "hidden",
              }}
            >
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
              <img
                src={src}
                style={{
                  maxWidth: "100%",
                  display: "block",
                }}
                alt=""
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
