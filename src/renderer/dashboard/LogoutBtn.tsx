import React from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import { resetStore } from "renderer/store/resetStore";
import { ConfirmDialog } from "renderer/components/dialogs/ConfirmDialog";
import { BottomButton } from "renderer/app/noteDrawer/drawerFooter/BottomButton";

export const LogoutBtn = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
    resetStore();
  };

  const [open, setOpen] = React.useState(false);

  return (
    <BottomButton
      title="Logout"
      action={() => setOpen(true)}
      icon={
        <>
          <ExitToAppIcon />
          <ConfirmDialog
            open={open}
            setOpen={setOpen}
            buttonText="Logout"
            action={handleLogout}
            string="Do you want to logout?"
          />
        </>
      }
    />
  );
};
