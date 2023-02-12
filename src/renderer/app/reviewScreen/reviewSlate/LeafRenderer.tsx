/* eslint-disable no-param-reassign */
import React from "react";
import { Leaf, SlateAttributes } from "main/database/schemas/nodeSchema";
import { styled } from "@mui/system";
import { reviewStore } from "renderer/store/reviewStore";
import { colorArray } from "renderer/utils/colors";

const RedactedSpan = styled("span")(`
  position: relative;
  white-space: pre;
  &:after {
    background: black;
    border-radius: 0.1em;
    box-shadow: 0 0 1px rgba(0,0,0,0.35);
    content: " ";
    width: 100%;
    height: 100%;
    left: 0;
    position: absolute;
  }
`);

const AnswerSpan = styled("span")(`
  background-color: ${colorArray[0].hex};
`);

export const LeafRenderer = ({
  attributes,
  leaf,
  children,
}: {
  attributes: SlateAttributes;
  leaf: Leaf;
  children: React.ReactChild;
}) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  const leafArray = Object.entries(leaf);
  let returnValue = <>{children}</>;
  const currentCard = reviewStore((s) => s.currentCard);
  const showAnswer = reviewStore((s) => s.showAnswer);
  if (!currentCard) throw Error("No current card at LeafRenderer");
  const { clozeNumber } = currentCard;

  leafArray.forEach(([key, value]) => {
    if (key.includes("clozeNumber") && value === clozeNumber) {
      if (!showAnswer) returnValue = <RedactedSpan>{children}</RedactedSpan>;
      if (showAnswer) returnValue = <AnswerSpan>{children}</AnswerSpan>;
    }
  });
  // eslint-disable-next-line react/jsx-props-no-spreading

  return <span {...attributes}>{returnValue}</span>;
};
