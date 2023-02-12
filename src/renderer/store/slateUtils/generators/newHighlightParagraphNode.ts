import { v4 } from "uuid";
import { SlateParagraph } from "main/database/schemas/nodeSchema";
import { Source } from "main/database/schemas/sourceSchema";

export const newHighlightParagraphNode = (
  source: Source,
  pageNumber: number,
  text: string,
  color: string
) => {
  const pdfTypes =
    source.type === "LOCAL_PDF" || source.type === "ONLINE_ARTICLE";
  if (!pdfTypes) throw Error("Invalid type");
  const pNode: SlateParagraph = {
    blockType: "Paragraph",
    children: [{ text: `${text}` }],
    list: false,
    image: null,
    id: v4(),
    nestedNodes: [],
    source: {
      type: source.type,
      id: source.id,
      time: null,
      page: pageNumber,
      color,
    },
  };
  return pNode;
};
