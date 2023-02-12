import { ipcMain } from "electron";
import { getLevelDb } from "main/database/createDbServer";
import { Flashcard } from "main/database/schemas/flashcardSchema";
import { AnyArray } from "main/database/forbiddenTypes";
import {
  ajvPasswordSchema,
  ajvUsernameSchema,
  UserDocument,
} from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { DeepReadonlyObject } from "rxdb";
import { validator } from "./validator";

export type ApprovedChannel = {
  listCurrentFlashcardsHandler: (
    noteIds: string[]
  ) => DeepReadonlyObject<Flashcard>[];
  listTodayFlashcardsHandler: (
    noteIds: string[]
  ) => DeepReadonlyObject<Flashcard>[];
  updateFlashcardHandler: (
    flashcard: Flashcard
  ) => DeepReadonlyObject<Flashcard>;
};

export type HandlerType<Arguments extends AnyArray, Data> = (
  user: UserDocument,
  db: RxMyDatabase,
  ...args: Arguments
) => Promise<{ message: string; data: Data }>;

export const errorWrapper = <Arguments extends AnyArray, Data>(
  unknownUsername: unknown,
  unknownPasssword: unknown,
  func: HandlerType<Arguments, Data>
) => {
  return async (...args: Arguments) => {
    try {
      const username = validator<string>(unknownUsername, ajvUsernameSchema);
      const password = validator<string>(unknownPasssword, ajvPasswordSchema);
      const db = await getLevelDb();
      const userDoc = await db.usercollection
        .findOne({
          selector: { username, password },
        })
        .exec();
      if (!userDoc) throw Error("Invalid username or password");
      const result = await func(userDoc, db, ...args);
      return {
        error: false,
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      console.error(JSON.stringify(args));
      console.error(error);
      return {
        error: true,
        message: (error as Error).message,
        data: null,
      };
    }
  };
};

export const mainIpcHandler = <K extends keyof ApprovedChannel>(
  channelName: K,
  func: HandlerType<
    Parameters<ApprovedChannel[K]>,
    ReturnType<ApprovedChannel[K]>
  >
) =>
  ipcMain.handle(
    channelName,
    async (event, username: string, password: string, ...args: AnyArray) => {
      const wrapped = errorWrapper(username, password, func);
      const response = await wrapped(
        ...(args as Parameters<ApprovedChannel[K]>)
      );
      return response;
    }
  );
