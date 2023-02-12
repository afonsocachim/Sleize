import React from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
import { sourceStore } from "renderer/store/sourceStore";
import {
  getPdfFileDataInvoker,
  updateLocalSourcePathInvoker,
} from "renderer/ipc/sourceInvokers";
import { pdfToolbarStore } from "renderer/pdfViewer/pdfToolbarStore";
import { LocalPdfSource } from "main/database/schemas/sourceSchema";
import { constructFileFromLocalFileData } from "renderer/utils/constructFileFromLocalFileData";
import { pdfStore } from "../../../pdfStore";
import { worker } from "../../pdfJsImports";
import PdfHighlighter from "../pdfHighlighter/PdfHighlighter";
import { LoadingSpinner } from "./LoadingSpinner";

export const PdfLoader = ({ pdfPath }: { pdfPath: string }) => {
  const pdfDocument = pdfStore((s) => s.pdfDocument);
  const setPdfDocument = pdfStore((s) => s.setPdfDocument);
  const setMaxPageNumber = pdfToolbarStore((s) => s.setMaxPageNumber);
  const setCurrentPageNumber = pdfToolbarStore((s) => s.setCurrentPageNumber);

  const load = async (docPath: string) => {
    setPdfDocument(undefined);

    GlobalWorkerOptions.workerSrc = worker;
    if (!docPath) return;

    const { source } = sourceStore.getState();
    if (!source) throw Error("No source");
    const result = await getPdfFileDataInvoker(source as LocalPdfSource);
    if (result.error) {
      if (result.message === "Invalid file path")
        updateLocalSourcePathInvoker(source);
      return;
    }

    const file = constructFileFromLocalFileData(result.data);
    const fileReader = new FileReader();
    fileReader.onload = function onLoad() {
      // eslint-disable-next-line react/no-this-in-sfc
      const holder = this.result as ArrayBufferLike;
      const typedarray = new Uint8Array(holder);
      const loadingTask = getDocument(typedarray);
      loadingTask.promise
        .then((pdf) => {
          setPdfDocument(pdf);
          setMaxPageNumber(pdf.numPages);
          setCurrentPageNumber(1, "arrow");
        })
        .catch((error) => console.error(error));
    };
    fileReader.readAsArrayBuffer(file);
  };

  React.useEffect(() => {
    if (pdfPath) load(pdfPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfPath]);

  return !pdfDocument ? <LoadingSpinner /> : <PdfHighlighter />;
};
