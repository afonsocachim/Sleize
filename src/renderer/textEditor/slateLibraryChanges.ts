import { v4 } from "uuid";
import {
  Node,
  Element,
  NodeProps,
  Transforms,
  Range,
  Point,
  BasePoint,
} from "slate";
import {
  SlateElement,
  SlateBaseProperties,
  headingArray,
  Headings,
  SlateEditor,
  Leaf,
} from "main/database/schemas/nodeSchema";
import { slateStore } from "renderer/store/slateStore";

const fixExtractProps = () => {
  Node.extractProps = (node: Node) => {
    if (Element.isAncestor(node)) {
      const { children, ...properties } = node as SlateElement;
      if (!properties.blockType) return properties as NodeProps;

      const newProperties: Partial<SlateBaseProperties> = {
        ...properties,
        id: v4(),
        blockType: "Paragraph",
        source: null,
        list: false,
      };

      if (headingArray.includes(properties.blockType as Headings)) {
        slateStore.setState({
          HeadingToToggle: { id: properties.id, toggle: true },
        });
      }

      if (properties.blockType === "Question") {
        newProperties.blockType = "Question";
        newProperties.list = properties.list;
      }
      if (properties.blockType === "Paragraph") {
        newProperties.list = properties.list;
      }

      return newProperties as NodeProps;
    }
    const { text, ...properties } = node;

    const newProperties = { ...properties, clozeNumber: 0 } as Leaf;
    delete newProperties.clozeNumber;

    return newProperties as NodeProps;
  };
};

const fixSetSelection = () => {
  Transforms.setSelection = (editor: SlateEditor, props: Partial<Range>) => {
    const { selection } = editor;
    const oldProps: Partial<Range> = { ...selection };
    const newProps: Partial<Range> = { ...selection, ...props };

    if (!selection) {
      return;
    }
    const keys = Object.keys(props);
    const anyProps = props as any;
    const anySelection = selection as any;

    for (let i = 0; i < keys.length; i += 1) {
      const k = keys[i];
      const isRangeBaseProp = k === "anchor" || k === "focus";
      const rangeBasePropChange =
        isRangeBaseProp &&
        props[k] &&
        !Point.equals(props[k] as BasePoint, selection[k]);
      const rangeExtendedPropChange =
        !isRangeBaseProp && anyProps[k] !== anySelection[k];

      if (rangeBasePropChange || rangeExtendedPropChange) {
        editor.apply({
          type: "set_selection",
          properties: oldProps,
          newProperties: newProps,
        });
        break;
      }
    }
  };
};

export const slateLibraryChanges = () => {
  fixExtractProps();
  fixSetSelection();
};
