import { v4 } from "uuid";
import { Transforms } from "slate";
import { SlateEditor, SlateElement } from "main/database/schemas/nodeSchema";
import { insertImage } from "renderer/textEditor/middleware/insertImage";
import { getInitialNode } from "../utils/getInitialNodes";

const catchSlateFragment = /data-slate-fragment="(.+?)"/m;
export const getSlateFragmentAttribute = (
  dataTransfer: DataTransfer
): string | void => {
  const htmlData = dataTransfer.getData("text/html");
  const [, fragment] = htmlData.match(catchSlateFragment) || [];
  return fragment;
};

export const specialPaste = (editor: SlateEditor) => {
  const { isVoid } = editor;
  editor.isVoid = (element) => {
    return element.blockType === "Image" ? true : isVoid(element);
  };

  editor.insertFragmentData = (localData: DataTransfer): boolean => {
    // Checking copied fragment from application/x-slate-fragment or data-slate-fragment
    const fragment =
      localData.getData("application/x-slate-fragment") ||
      getSlateFragmentAttribute(localData);

    if (fragment) {
      const decoded = decodeURIComponent(window.atob(fragment));
      const nodes = JSON.parse(decoded) as SlateElement[];
      const newNodes = nodes.map((n) => ({ ...n, id: v4() }));
      editor.insertFragment(newNodes);
      return true;
    }
    return false;
  };

  editor.insertTextData = (localData: DataTransfer): boolean => {
    const text = localData.getData("text/plain");

    if (text) {
      const lines = text.split(/\r\n|\r|\n/);
      let split = false;

      lines.forEach((line) => {
        if (split) {
          Transforms.splitNodes(editor, { always: true });
        }
        const newNode = getInitialNode();
        newNode.children = [{ text: line }];
        editor.insertFragment([newNode]);
        split = true;
      });
      return true;
    }
    return false;
  };

  editor.insertData = (data: DataTransfer) => {
    const { items } = data;

    // Skip content if not image
    if (items[0].type.indexOf("image") !== -1) {
      // Retrieve image on clipboard as blob
      const blob = items[0].getAsFile();
      if (blob) {
        insertImage(blob, editor);
        return;
      }
    }
    if (!editor.insertFragmentData(data)) {
      editor.insertTextData(data);
    }
  };

  return editor;
};
