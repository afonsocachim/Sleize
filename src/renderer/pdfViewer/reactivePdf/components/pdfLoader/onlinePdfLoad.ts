import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { pdfStore } from "../../../pdfStore";

const workerSrc =
  "https://unpkg.com/pdfjs-dist@2.8.335/build/pdf.worker.min.js";

export const onlinePdfLoad = async (url: string) => {
  const { pdfDocument, setPdfDocument } = pdfStore.getState();
  const discardedDocument = pdfDocument;
  setPdfDocument(undefined);

  if (typeof workerSrc === "string") GlobalWorkerOptions.workerSrc = workerSrc;

  Promise.resolve()
    .then(() => discardedDocument && discardedDocument.destroy())
    .then(() => (url ? getDocument(url) : false))
    .then((promisedPdf) => {
      if (promisedPdf) return promisedPdf.promise;
      return undefined;
    })
    .then((p) => {
      if (p) setPdfDocument(p);
    })
    // eslint-disable-next-line no-console
    .catch((e) => console.error(e));
};
