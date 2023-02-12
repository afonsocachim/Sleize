import { v4 } from "uuid";
import { titleSchema } from "main/database/miscSchemas/titleSchema";
import { uuidSchema } from "main/database/miscSchemas/uuidSchema";
import { ajvNoteSchema, Note } from "main/database/schemas/noteSchema";
import { UserDocument } from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { getInitialNodes } from "main/ipc/userController/userHandlers/createUserHandler/getInitialNodes";
import { validator } from "main/ipc/validator";

export const insertNoteHandler = async (
  user: UserDocument,
  db: RxMyDatabase,
  unknownNoteTitle: unknown,
  unknownParent: unknown
) => {
  const title = validator<string>(unknownNoteTitle, titleSchema);
  const parent = validator<string>(unknownParent, uuidSchema);
  const newNote: Note = {
    id: v4(),
    parent,
    text: title,
    droppable: true,
    data: {
      owner: user.username,
      nodes: getInitialNodes(),
      deletedFlashcards: {},
    },
  };

  await db.notecollection.insert(newNote);
  return { message: "Note added", data: newNote };
};
