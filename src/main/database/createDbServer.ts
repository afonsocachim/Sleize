import { createRxDatabase, getRxStoragePouch } from "rxdb";
import { addPouchPlugin } from "rxdb/plugins/pouchdb";
import pouchDbAdapter from "pouchdb-adapter-leveldb";
import memdown from "memdown";
import leveldown from "leveldown";
import { app } from "electron";
// add the server-plugin
// add the memory-adapter
import { addCollections } from "./addCollections";
import { MyDatabase, RxMyDatabase } from "./types";

const adapter = process.env.NODE_ENV === "development" ? memdown : leveldown;
addPouchPlugin(pouchDbAdapter);

const dbPath =
  process.env.NODE_ENV === "development"
    ? "memdowndb"
    : `${app.getPath("userData")}\\UserDatabase\\Sleize`;

let cachedGetDatabse: Promise<RxMyDatabase> | undefined;

export const createDb = async () => {
  // create database
  const db = await createRxDatabase<MyDatabase>({
    name: dbPath,
    storage: getRxStoragePouch(adapter),
    password: "myLongAndStupidPassword",
  });

  await addCollections(db);

  return db;
};

export const getLevelDb = () => {
  if (!cachedGetDatabse) {
    cachedGetDatabse = createDb();
  }
  return cachedGetDatabse;
};
