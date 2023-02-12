import { PDFViewer, PDFFindController } from "pdfjs-dist/legacy/web/pdf_viewer";
// @ts-ignore
import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { ViewerObject } from "./viewerObject";

export const initializeViewer = (
  pdfDocument: PDFDocumentProxy,
  viewerObject: ViewerObject
) => {
  const viewerOptions = {
    container: viewerObject.containerNode,
    eventBus: viewerObject.eventBus,
    enhanceTextSelection: true,
    removePageBorders: true,
    linkService: viewerObject.linkService,
    findController: new PDFFindController({
      eventBus: viewerObject.eventBus,
      linkService: viewerObject.linkService,
    }),
  } as any;
  const viewerClass = new PDFViewer(viewerOptions);
  viewerObject.linkService.setDocument(pdfDocument);
  viewerObject.linkService.setViewer(viewerClass);
  viewerClass.setDocument(pdfDocument);

  viewerObject.viewer = viewerClass;
};
