/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { SlateAttributes, Leaf } from "main/database/schemas/nodeSchema";
import { slateStore } from "renderer/store/slateStore";
import { ClozeRenderer } from "./leafRenderer/ClozeRenderer";

type LeafProps = {
  attributes: SlateAttributes;
  children: React.ReactChild;
  leaf: Leaf;
};

const reg1 = /{{c\d::(.*?)(?:::[^:]+)?}}/g;

export const LeafRenderer = ({ attributes, children, leaf }: LeafProps) => {
  const ref = React.useRef<HTMLElement | null>(null);
  const [showCloze, setShowCloze] = React.useState(false);
  const parentIsSelected = !!(children as any)?.props?.parent?.selected;

  children = <ClozeRenderer leaf={leaf}>{children}</ClozeRenderer>;

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.highlight) {
    children = (
      <span
        ref={ref}
        style={{ backgroundColor: "#ffeeba" }}
        id="SlateDecorator"
      >
        <span style={{ display: parentIsSelected ? "inline" : "none" }}>
          {children}
        </span>
        {!parentIsSelected && (
          <span style={{ userSelect: "none" }} contentEditable={false}>
            {leaf.text.split(reg1).join("")}
          </span>
        )}
      </span>
    );
  }

  return (
    <span {...attributes} style={{ paddingRight: "0.1px" }}>
      {children}
    </span>
  );
};
