import { AiFillFilePdf, AiOutlineYoutube } from "react-icons/ai";
import { FcVideoFile } from "react-icons/fc";
import { RiArticleLine } from "react-icons/ri";
import { BaseSlateSource } from "main/database/schemas/nodeSchema";

export const IconFromSourceType = ({
  ext,
}: {
  ext: BaseSlateSource["type"];
}) => {
  if (ext === "LOCAL_PDF") {
    return (
      <AiFillFilePdf style={{ color: "#D51C00", height: 16, width: 16 }} />
    );
  }
  if (ext === "LOCAL_VIDEO") {
    return <FcVideoFile style={{ height: 16, width: 16 }} />;
  }
  if (ext === "ONLINE_VIDEO")
    return (
      <AiOutlineYoutube style={{ color: "#D51C00", height: 16, width: 16 }} />
    );
  if (ext === "ONLINE_ARTICLE")
    return (
      <RiArticleLine style={{ color: "#2C8680", height: 16, width: 16 }} />
    );
  return null;
};
