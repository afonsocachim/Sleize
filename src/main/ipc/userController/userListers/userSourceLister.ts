import { Subscription } from "rxjs";
import { getLevelDb } from "main/database/createDbServer";
import { BrowserWindow } from "electron";
import { mainStore } from "main/store/mainStore";

let sub: Subscription | undefined;

export const userSourceLister = async (channel: string) => {
  mainStore.subscribe(async ({ user }) => {
    if (sub) sub.unsubscribe();
    const win = BrowserWindow.getFocusedWindow();
    if (!win) return;
    if (!user) return;
    const db = await getLevelDb();
    const listSources = async () => {
      const docs = await db.sourcecollection
        .find({ selector: { owner: user.username } })
        .exec();
      const sources = docs.map((d) => d.toJSON());
      win.webContents.send(channel, sources);
    };
    await listSources();
    sub = db.sourcecollection.$.subscribe(async () => {
      await listSources();
    });
  });
};
