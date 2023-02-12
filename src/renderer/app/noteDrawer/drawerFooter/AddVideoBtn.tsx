import { IconFromSourceType } from "renderer/components/IconFromExtension";
import { insertLocalVideoInvoker } from "renderer/ipc/sourceInvokers";
import { BottomButton } from "./BottomButton";

export const AddVideoBtn = () => {
  return (
    <BottomButton
      title="Video"
      action={insertLocalVideoInvoker}
      icon={<IconFromSourceType ext="LOCAL_VIDEO" />}
    />
  );
};
