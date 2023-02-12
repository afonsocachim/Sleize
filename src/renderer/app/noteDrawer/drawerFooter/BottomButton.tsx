import { IconButton, Tooltip } from "@mui/material";

export const BottomButton = ({
  title,
  action,
  icon,
}: {
  title: string;
  action: () => void;
  icon: JSX.Element;
}) => {
  return (
    <Tooltip title={title}>
      <IconButton size="small" onClick={action}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};
