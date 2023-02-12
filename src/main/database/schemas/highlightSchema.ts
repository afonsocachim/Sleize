import { JSONSchemaType } from "ajv";
// @ts-ignore
import type { PDFDocumentProxy } from "pdfjs-dist/types/display/api";

export type LTWH = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type OriginalPageDimensions = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
};

export const ajvOriginalPageDimensions: JSONSchemaType<OriginalPageDimensions> =
  {
    type: "object",
    properties: {
      bottom: { type: "number" },
      height: { type: "number" },
      left: { type: "number" },
      right: { type: "number" },
      top: { type: "number" },
      width: { type: "number" },
      x: { type: "number" },
      y: { type: "number" },
    },
    required: ["left", "top", "width", "height"],
  };

export const ajvRectPage: JSONSchemaType<LTWH> = {
  type: "object",
  properties: {
    left: { type: "number" },
    top: { type: "number" },
    width: { type: "number" },
    height: { type: "number" },
  },
  required: ["left", "top", "width", "height"],
};

export type ViewportPosition = {
  boundingRect: LTWH;
  rects: Array<LTWH>;
  pageNumber: number;
  originalPage: OriginalPageDimensions;
};

export const ajvViewportPosition: JSONSchemaType<ViewportPosition> = {
  type: "object",
  properties: {
    boundingRect: ajvRectPage,
    rects: { type: "array", items: ajvRectPage },
    pageNumber: { type: "number" },
    originalPage: ajvOriginalPageDimensions,
  },
  required: ["boundingRect", "rects", "pageNumber", "originalPage"],
};

export type HighlightContent = { text?: string; image?: string };

export type HighlightViewport = {
  id: string;
  color: string;
  comment: string;
  content: HighlightContent;
  position: ViewportPosition;
};

export type Viewport = {
  convertToPdfPoint: (x: number, y: number) => Array<number>;
  convertToViewportRectangle: (pdfRectangle: Array<number>) => Array<number>;
  width: number;
  height: number;
};

export type EventBusType = {
  on: (eventName: string, callback: () => void) => void;
  off: (eventName: string, callback: () => void) => void;
};

type ExecuteCommandOptions = {
  query: string;
  phraseSearch: boolean;
  caseSensitive: boolean;
  entireWord: boolean;
  highlightAll: boolean;
  findPrevious: boolean;
};

export type PdfFindControllerType = {
  executeCommand: (s: "findagain" | "", n: ExecuteCommandOptions) => void;
};

export type PDFJSViewerType = {
  container: HTMLDivElement;
  viewer: HTMLDivElement;
  getPageView: (page: number) => {
    textLayer: { textLayerDiv: HTMLDivElement };
    viewport: Viewport;
    div: HTMLDivElement;
    canvas: HTMLCanvasElement;
  };
  setDocument: (document: PDFDocumentProxy) => Promise<void>;
  scrollPageIntoView: (options: {
    pageNumber: number;
    destArray: Array<any>;
  }) => void;
  currentScaleValue: string;
  pagesCount: number;
  currentPageNumber: number;
  findController: PdfFindControllerType;
};

export type PDFJSLinkService = {
  setDocument: (document: unknown) => void;
  setViewer: (viewer: PDFJSViewerType) => void;
};

export type Page = {
  node: HTMLElement;
  number: number;
};
