import { Subscription } from "rxjs";
import { getLevelDb } from "main/database/createDbServer";
import { BrowserWindow } from "electron";
import { mainStore } from "main/store/mainStore";
import { Flashcard } from "main/database/schemas/flashcardSchema";

let sub: Subscription | undefined;

export const userFlashcardLister = async (channel: string) => {
  mainStore.subscribe(async ({ user, lastMinuteOfToday }) => {
    if (sub) sub.unsubscribe();
    const win = BrowserWindow.getFocusedWindow();
    if (!win) return;
    if (!user) return;
    const db = await getLevelDb();
    const listFlashcards = async () => {
      const docs = await db.flashcardcollection
        .find({
          selector: {
            owner: user.username,
            dueDate: { $lte: lastMinuteOfToday },
          },
          sort: [{ dueDate: "asc" }],
        })
        .exec();
      const cards = docs.map((d) => d.toJSON());
      win.webContents.send(channel, cards);
    };
    await listFlashcards();
    sub = db.flashcardcollection.$.subscribe(async () => {
      await listFlashcards();
    });
  });
};
