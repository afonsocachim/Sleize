import { v4 } from "uuid";
import { SlateImage } from "main/database/schemas/nodeSchema";
import { Source } from "main/database/schemas/sourceSchema";

export const newHighlightImageNode = (
  source: Source,
  pageNumber: number,
  src: string,
  color: string
) => {
  const pdfTypes =
    source.type === "LOCAL_PDF" || source.type === "ONLINE_ARTICLE";
  if (!pdfTypes) throw Error("Invalid type");
  const imageNode: SlateImage = {
    blockType: "Image",
    children: [{ text: "" }],
    list: false,
    id: v4(),
    image: { isCollapsed: false, imageText: "", svgObjects: [], src },
    nestedNodes: [],
    source: {
      type: source.type,
      id: source.id,
      time: null,
      page: pageNumber,
      color,
    },
  };
  return imageNode;
};
