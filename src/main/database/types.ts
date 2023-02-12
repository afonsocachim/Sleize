import { RxDatabase } from "rxdb";
import { NoteCollection } from "./schemas/noteSchema";
import { SourceCollection } from "./schemas/sourceSchema";
import { UserCollection } from "./schemas/userSchema";
import { FlashcardCollection } from "./schemas/flashcardSchema";

export type MyDatabase = {
  notecollection: NoteCollection;
  sourcecollection: SourceCollection;
  usercollection: UserCollection;
  flashcardcollection: FlashcardCollection;
};

export const collectionNames: Array<keyof MyDatabase> = [
  "notecollection",
  "sourcecollection",
  "usercollection",
  "flashcardcollection",
];

export type RxMyDatabase = RxDatabase<MyDatabase, any, any>;
