import {
  EventBus,
  PDFLinkService,
  PDFViewer,
} from "pdfjs-dist/legacy/web/pdf_viewer";

const eventBus = new EventBus();
const linkService = new PDFLinkService({
  eventBus,
  externalLinkTarget: 2,
});

export type ViewerObject = {
  eventBus: EventBus;
  linkService: PDFLinkService;
  viewer: PDFViewer | undefined;
  containerNode: HTMLDivElement | undefined;
  unsubscribe: () => void;
  resizeObserver: ResizeObserver | undefined;
};

export const initialViewerObject: ViewerObject = {
  eventBus,
  linkService,
  viewer: undefined,
  unsubscribe: () => {},
  resizeObserver: undefined,
  containerNode: undefined,
};

export const viewerObject = initialViewerObject;

export const resetViewerObject = () => {
  viewerObject.unsubscribe();
  viewerObject.eventBus = initialViewerObject.eventBus;
  viewerObject.linkService = initialViewerObject.linkService;
  viewerObject.viewer = initialViewerObject.viewer;
  viewerObject.unsubscribe = initialViewerObject.unsubscribe;
  viewerObject.resizeObserver = initialViewerObject.resizeObserver;
  viewerObject.containerNode = initialViewerObject.containerNode;
};
