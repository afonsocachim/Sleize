import { v4 } from "uuid";
import { validator } from "main/ipc/validator";
import { getLevelDb } from "main/database/createDbServer";
import {
  ajvUsernameSchema,
  User,
  ajvPasswordSchema,
} from "main/database/schemas/userSchema";
import { NotebookObj, SectionObj } from "main/database/schemas/librarySchema";
import { Note } from "main/database/schemas/noteSchema";
import { createUserFolder } from "./createUserFolder";
import { getInitialNodes } from "./getInitialNodes";

export const createUserHandler = async (
  unknownUsername: unknown,
  unknownPassword: unknown
) => {
  // verify user and password
  const username = validator<string>(unknownUsername, ajvUsernameSchema);
  const password = validator<string>(unknownPassword, ajvPasswordSchema);
  const firstSection: SectionObj = {
    id: v4(),
    title: "First section",
  };

  const firstNote: Note = {
    id: v4(),
    parent: firstSection.id,
    text: "First note",
    droppable: true,
    data: {
      owner: username,
      nodes: getInitialNodes(),
      deletedFlashcards: {},
    },
  };
  const firstNotebook: NotebookObj = {
    id: v4(),
    title: "First notebook",
    sectionIds: [firstSection.id],
  };
  const newUser: User = {
    username,
    password,
    library: {
      sections: { [firstSection.id]: firstSection },
      notebooks: { [firstNotebook.id]: firstNotebook },
      notebookOrder: [firstNotebook.id],
    },
  };
  const db = await getLevelDb();
  await db.notecollection.insert(firstNote);
  const user = await db.usercollection
    .findOne({ selector: { username } })
    .exec();
  if (user) {
    throw Error("Username taken");
  }
  await db.usercollection.insert(newUser);
  createUserFolder(username);
  return { message: "User created", data: null };
};
