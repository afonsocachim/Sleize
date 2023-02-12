import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

import { BottomButton } from "../app/noteDrawer/drawerFooter/BottomButton";

export const ProfileBtn = () => {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <BottomButton
      title="Change password"
      action={handleProfile}
      icon={<PersonIcon />}
    />
  );
};
