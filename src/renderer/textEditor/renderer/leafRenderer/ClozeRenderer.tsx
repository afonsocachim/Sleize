/* eslint-disable no-param-reassign */
import React from "react";
import { styled } from "@mui/system";
import { Leaf, SlateQuestion } from "main/database/schemas/nodeSchema";
import { colorArray } from "renderer/utils/colors";
import { editorContainer } from "renderer/store/slateUtils/editorContainer";
import { ReactEditor } from "slate-react";
import { Transforms } from "slate";
import { font } from "renderer/styles/lightTheme";

type InputProps = { width: string };

const MyInput = styled("input")`
  border: none;
  border-width: 0;
  box-shadow: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &:focus {
    outline: none;
  }
  background-color: #555;
  color: white;
  font-size: 15px;
  font-family: ${font};
  font-style: normal;
  font-variant: normal;
  margin: 0px;
  padding: 0px;
  padding-left: 1px;
  width: ${(props: InputProps) => props.width};
  max-width: ${(props: InputProps) => props.width}; ;
`;

const ContainerSpan = styled("span")`
  background-color: ${(props: { backgroundcolor: string }) =>
    props.backgroundcolor};
`;
type Opacity = 0 | 1;
type Visibility = "visibile" | "hidden";
type TooltipProps = { visibility: Visibility; opacity: Opacity };

const MySpan = styled("span")`
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 0px 5px;
  position: absolute;
  z-index: 4000;
  align-items: center;
  margin: 0;
  visibility: ${(props: TooltipProps) => props.visibility};
  opacity: ${(props: TooltipProps) => props.opacity};
  border: none;
  transition: opacity 0.3s;
`;

type ClozeProps = {
  leaf: Leaf;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
};

export const ClozeRenderer = (props: ClozeProps) => {
  const { leaf, children } = props;
  const { parent }: { parent: SlateQuestion } = children.props;
  const leafClozeNumber = leaf.clozeNumber;

  const [visibility, setVisibility] = React.useState<Visibility>("visibile");
  const [opacity, setOpacity] = React.useState<Opacity>(0);
  const showTooltip = () => {
    setVisibility("visibile");
    setOpacity(1);
  };
  const hideTooltip = () => {
    setVisibility("hidden");
    setOpacity(0);
  };
  if (typeof leafClozeNumber !== "number") return <>{children}</>;

  const index = (leafClozeNumber - 1) % 6;
  const color = colorArray[index].hex;
  const { length } = leafClozeNumber.toString();
  const width = `${length * 10}px`;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { editor } = editorContainer;
    const value = editor.children;
    let newClozeNumber = parseInt(e.target.value, 10);
    if (newClozeNumber < 1) newClozeNumber = 1;
    if (newClozeNumber > 99) newClozeNumber = 99;
    if (Number.isNaN(newClozeNumber)) newClozeNumber = 1;
    const path = ReactEditor.findPath(editor, parent);
    const node = value[path[0]] as SlateQuestion;
    const newChildren = node.children.map((child): Leaf => {
      const isCurrentLeaf =
        child.text === leaf.text && child.clozeNumber === leafClozeNumber;
      if (!isCurrentLeaf) return child;
      const newChild = { ...child, clozeNumber: newClozeNumber };
      return newChild;
    });
    const newNode: SlateQuestion = { ...node, children: newChildren };
    Transforms.removeNodes(editor, { at: path });
    Transforms.insertNodes(editor, newNode, { at: path });
  };

  return (
    <ContainerSpan
      backgroundcolor={color}
      onMouseOver={showTooltip}
      onMouseOut={hideTooltip}
    >
      {children}
      <MySpan contentEditable={false} visibility={visibility} opacity={opacity}>
        <MyInput
          value={leafClozeNumber}
          min={1}
          max={99}
          onChange={handleInputChange}
          type="number"
          width={width}
        />
      </MySpan>
    </ContainerSpan>
  );
};
