import { BrowserWindow } from "electron";
import { v4 } from "uuid";
import { getLevelDb } from "main/database/createDbServer";

export const detectFlashcardChangeLister = async (channel: string) => {
  const db = await getLevelDb();
  db.flashcardcollection.$.subscribe(async () => {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) return;
    win.webContents.send(channel, v4());
  });
};
