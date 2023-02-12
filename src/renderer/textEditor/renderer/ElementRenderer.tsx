/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import {
  SlateElement,
  SlateAttributes,
  SlateEditor,
  headingArray,
} from "main/database/schemas/nodeSchema";
import rendererStyles from "./elementRenderer/headingStyles";
import { QuestionRenderer } from "./elementRenderer/QuestionRenderer";
import MainWrapper from "./mainWrapper/MainWrapper";
import { ImageRenderer } from "./imageWrapper/ImageRenderer";
import { CodeRenderer } from "./elementRenderer/CodeRenderer";

export const RenderElement = ({
  attributes,
  children,
  element,
  editor,
}: {
  attributes: SlateAttributes;
  children: React.ReactNode;
  element: SlateElement;
  editor: SlateEditor;
}) => {
  const isHeading = Boolean(headingArray.find((h) => h === element.blockType));
  const classes: any = rendererStyles();
  if (isHeading) {
    const number: string = element.blockType[element.blockType.length - 1];
    const usedClass: React.HTMLAttributes<HTMLParagraphElement> =
      classes[`h${number}`];
    return (
      <MainWrapper element={element} isHeading={isHeading} editor={editor}>
        <p className={usedClass} {...attributes}>
          {children}
        </p>
      </MainWrapper>
    );
  }
  switch (element.blockType) {
    // BLOCKS
    case "Paragraph":
      return (
        <MainWrapper element={element} isHeading={isHeading} editor={editor}>
          <p {...attributes}>{children}</p>
        </MainWrapper>
      );
    case "Code":
      return (
        <MainWrapper element={element} isHeading={isHeading} editor={editor}>
          <CodeRenderer attributes={attributes}>{children}</CodeRenderer>
        </MainWrapper>
      );
    case "Image":
      return (
        <MainWrapper element={element} isHeading={isHeading} editor={editor}>
          <ImageRenderer element={element} attributes={attributes}>
            {children}
          </ImageRenderer>
        </MainWrapper>
      );
    case "Question":
      return (
        <MainWrapper element={element} isHeading={isHeading} editor={editor}>
          <QuestionRenderer attributes={attributes}>
            {children}
          </QuestionRenderer>
        </MainWrapper>
      );
      break;
    default:
      return (
        <MainWrapper element={element} isHeading={isHeading} editor={editor}>
          <p {...attributes}>{children}</p>{" "}
        </MainWrapper>
      );
  }
};
