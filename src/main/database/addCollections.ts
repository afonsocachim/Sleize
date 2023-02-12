import { noteSchema } from "./schemas/noteSchema";
import { sourceSchema } from "./schemas/sourceSchema";
import { rxdbUserSchema } from "./schemas/userSchema";
import { flashcardSchema } from "./schemas/flashcardSchema";
import { RxMyDatabase } from "./types";

export const addCollections = async (db: RxMyDatabase) => {
  await db.addCollections({
    notecollection: { schema: noteSchema },
    sourcecollection: { schema: sourceSchema },
    usercollection: { schema: rxdbUserSchema },
    flashcardcollection: { schema: flashcardSchema },
  });
};
