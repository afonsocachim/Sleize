import { Subscription } from "rxjs";
import { getLevelDb } from "main/database/createDbServer";
import { BrowserWindow } from "electron";
import { mainStore } from "main/store/mainStore";

let sub: Subscription | undefined;

export const userNoteLister = async (channel: string) => {
  mainStore.subscribe(async ({ user }) => {
    if (sub) sub.unsubscribe();
    const win = BrowserWindow.getFocusedWindow();
    if (!win) return;
    if (!user) return;
    const db = await getLevelDb();
    const listNotes = async () => {
      const docs = await db.notecollection
        .find({ selector: { "data.owner": user.username } })
        .exec();
      const filteredDocs = docs.filter((d) => d.deleted === false);
      const notes = filteredDocs.map((d) => d.toJSON());
      win.webContents.send(channel, notes);
    };
    await listNotes();
    sub = db.notecollection.$.subscribe(async () => {
      await listNotes();
    });
  });
};
