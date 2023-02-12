import { insertLocalPdfInvoker } from "renderer/ipc/sourceInvokers";
import { IconFromSourceType } from "renderer/components/IconFromExtension";
import { BottomButton } from "./BottomButton";

export const AddPdfBtn = () => {
  return (
    <BottomButton
      title="Pdf"
      action={insertLocalPdfInvoker}
      icon={<IconFromSourceType ext="LOCAL_PDF" />}
    />
  );
};
