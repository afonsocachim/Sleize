import { cloneDeep } from "lodash";
import {
  SlateBaseProperties,
  SlateElement,
} from "main/database/schemas/nodeSchema";
import { slateStore } from "../slateStore";
import { editorContainer } from "./editorContainer";

export const resetAndSetSlateValue = async (
  newValue: SlateBaseProperties[]
) => {
  const { editor } = editorContainer;
  const clonedValue = cloneDeep(newValue) as SlateElement[];
  editor.selection = null;

  editor.history = {
    undos: [],
    redos: [],
  };
  editor.children = clonedValue;
  editor.onChange();
  slateStore.setState({ value: clonedValue });
};
