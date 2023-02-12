import Home from "@mui/icons-material/Home";
import { handleHomeClick } from "renderer/store/resetStore";
import { BottomButton } from "./BottomButton";

export const HomeBtn = () => {
  return <BottomButton title="Home" action={handleHomeClick} icon={<Home />} />;
};
