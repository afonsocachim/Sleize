import { ipcMain } from "electron";
import { Source } from "main/database/schemas/sourceSchema";
import { errorWrapper } from "../errorWrapper";
import { bulkRemoveSourceHandler } from "./sourceHandlers/bulkRemoveSourceHandler";
import { updateSourceHandler } from "./sourceHandlers/updateSourceHandler";
import { insertSourceHandler } from "./sourceHandlers/insertSourceHandler";
import { insertLocalVideoHandler } from "./sourceHandlers/insertLocalVideoHandler";
import { insertLocalPdfHandler } from "./sourceHandlers/insertLocalPdfHandler";
import { getSourceFromIdHandler } from "./sourceHandlers/getSourceFromIdHandler";
import { updateLocalSourcePathHandler } from "./sourceHandlers/updateLocalSourcePathHandler";
import { getVideoAndSubBufferHandler } from "./sourceHandlers/getVideoAndSubBufferHandler";
import { getPdfFileDataHandler } from "./sourceHandlers/getPdfFileDataHandler";
import { insertArticleHandler } from "./sourceHandlers/insertArticleHandler";
import { insertOnlineVideoHandler } from "./sourceHandlers/insertOnlineVideoHandler";

export const sourceController = () => {
  ipcMain.handle(
    "sources/insert/online_video",
    async (
      event,
      username: string,
      password: string,
      url: string,
      title: string
    ) => {
      const wrapped = errorWrapper(
        username,
        password,
        insertOnlineVideoHandler
      );
      const response = await wrapped(url, title);
      return response;
    }
  );

  ipcMain.handle(
    "sources/insert/article",
    async (
      event,
      username: string,
      password: string,
      url: string,
      title: string
    ) => {
      const wrapped = errorWrapper(username, password, insertArticleHandler);
      const response = await wrapped(url, title);
      return response;
    }
  );

  ipcMain.handle(
    "sources/get/pdf_file_Data",
    async (event, username: string, password: string, pdfSource: Source) => {
      const wrapped = errorWrapper(username, password, getPdfFileDataHandler);
      const response = await wrapped(pdfSource);
      return response;
    }
  );

  ipcMain.handle(
    "sources/get/video_and_sub",
    async (event, username: string, password: string, videoSource: Source) => {
      const wrapped = errorWrapper(
        username,
        password,
        getVideoAndSubBufferHandler
      );
      const response = await wrapped(videoSource);
      return response;
    }
  );

  ipcMain.handle(
    "sources/update/local_path",
    async (event, username: string, password: string, oldSource: Source) => {
      const wrapped = errorWrapper(
        username,
        password,
        updateLocalSourcePathHandler
      );
      const response = await wrapped(oldSource);
      return response;
    }
  );

  ipcMain.handle(
    "sources/get/id",
    async (event, username: string, password: string, sourceId: string) => {
      const wrapped = errorWrapper(username, password, getSourceFromIdHandler);
      const response = await wrapped(sourceId);
      return response;
    }
  );

  ipcMain.handle(
    "sources/insert/local_pdf",
    async (event, username: string, password: string) => {
      const wrapped = errorWrapper(username, password, insertLocalPdfHandler);
      const response = await wrapped();
      return response;
    }
  );

  ipcMain.handle(
    "sources/insert/local_video",
    async (event, username: string, password: string) => {
      const wrapped = errorWrapper(username, password, insertLocalVideoHandler);
      const response = await wrapped();
      return response;
    }
  );

  ipcMain.handle(
    "sources/insert",
    async (event, username: string, password: string, newSource: Source) => {
      const wrapped = errorWrapper(username, password, insertSourceHandler);
      const response = await wrapped(newSource);
      return response;
    }
  );

  ipcMain.handle(
    "sources/remove",
    async (event, username: string, password: string, ids: string[]) => {
      const wrapped = errorWrapper(username, password, bulkRemoveSourceHandler);
      const response = await wrapped(ids);
      return response;
    }
  );

  ipcMain.handle(
    "sources/update",
    async (event, username: string, password: string, newSource: Source) => {
      const wrapped = errorWrapper(username, password, updateSourceHandler);
      const response = await wrapped(newSource);
      return response;
    }
  );
};
