import { ipcMain } from "electron";
import { Note } from "main/database/schemas/noteSchema";
import { errorWrapper } from "../errorWrapper";
import { getNotesHandler } from "./notesHandler/getNotesHandler";
import { getSectionNotesHandler } from "./notesHandler/getSectionNotesHandler";
import { insertNoteHandler } from "./notesHandler/insertNoteHandler";
import { removeNotesHandler } from "./notesHandler/removeNotesHandler";
import { updateNoteHandler } from "./notesHandler/updateNoteHandler";

export const notesController = () => {
  ipcMain.handle(
    "notes/get/section",
    async (event, username: string, password: string, sectionIds: string[]) => {
      const wrapped = errorWrapper(username, password, getSectionNotesHandler);
      const response = await wrapped(sectionIds);
      return response;
    }
  );

  ipcMain.handle(
    "notes/get/note_ids",
    async (event, username: string, password: string, noteIds: string[]) => {
      const wrapped = errorWrapper(username, password, getNotesHandler);
      const response = await wrapped(noteIds);
      return response;
    }
  );

  ipcMain.handle(
    "notes/insert",
    async (
      event,
      username: string,
      password: string,
      noteTitle: string,
      parent: string
    ) => {
      const wrapped = errorWrapper(username, password, insertNoteHandler);
      const response = await wrapped(noteTitle, parent);
      return response;
    }
  );

  ipcMain.handle(
    "notes/update",
    async (event, username: string, password: string, newNote: Note) => {
      const wrapped = errorWrapper(username, password, updateNoteHandler);
      const response = await wrapped(newNote);
      return response;
    }
  );

  ipcMain.handle(
    "notes/remove",
    async (event, username: string, password: string, noteIds: string[]) => {
      const wrapped = errorWrapper(username, password, removeNotesHandler);
      const response = await wrapped(noteIds);
      return response;
    }
  );
};
