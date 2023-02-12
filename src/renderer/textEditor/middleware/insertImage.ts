import { SlateEditor, SlateImage } from "main/database/schemas/nodeSchema";
import { getInitialNode } from "renderer/textEditor/utils/getInitialNodes";
import { blobToDataURL } from "renderer/textEditor/utils/blobToDataURL";

export const insertImage = (blob: File, editor: SlateEditor) => {
  let imageUrl: string | ArrayBuffer | null | undefined;
  blobToDataURL(blob, (dataUrl) => {
    imageUrl = dataUrl;
  });

  const i = setInterval(() => {
    // Typically only runs once
    if (typeof imageUrl === undefined) return;
    clearInterval(i);
    if (typeof imageUrl !== "string") return;
    const originalElement = getInitialNode();
    const image: SlateImage = {
      ...originalElement,
      children: [{ text: "" }],
      blockType: "Image",
      list: false,
      source: null,
      image: {
        isCollapsed: false,
        imageText: "",
        svgObjects: [],
        src: imageUrl,
      },
    };

    editor.insertNode(image);
  }, 100);
};
