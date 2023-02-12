import { toast } from "react-toastify";
import { Note } from "main/database/schemas/noteSchema";
import { userStore } from "renderer/store/userStore";
import { sectionStore } from "renderer/store/sectionStore";
import { Invoker, invokeWrapper } from "./invokeWrapper";

export const getSectionNotesInvoker = async (sectionId: string[]): Invoker => {
  const oldUser = userStore.getState().user;
  if (!oldUser) throw Error("No user");
  const result = await invokeWrapper(
    "notes/get/section",
    oldUser.username,
    oldUser.password,
    sectionId
  );
  const { error, message } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  return result;
};

export const getNotesInvoker = async (noteIds: string[]): Invoker => {
  const oldUser = userStore.getState().user;
  if (!oldUser) throw Error("No user");
  const result = await invokeWrapper(
    "notes/get/note_ids",
    oldUser.username,
    oldUser.password,
    noteIds
  );
  const { error, message } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  return result;
};

export const insertNoteInvoker = async (title: string): Invoker => {
  const oldUser = userStore.getState().user;
  if (!oldUser) throw Error("No user");
  const { section } = sectionStore.getState();
  if (!section) throw Error("No section");
  const result = await invokeWrapper(
    "notes/insert",
    oldUser.username,
    oldUser.password,
    title,
    section.id
  );
  const { error, message } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  toast.success(message);
  return result;
};

export const updateNoteInvoker = async (newNote: Note): Invoker => {
  const oldUser = userStore.getState().user;
  if (!oldUser) throw Error("No user");
  const result = await invokeWrapper(
    "notes/update",
    oldUser.username,
    oldUser.password,
    newNote
  );
  const { error, message } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  return result;
};

export const removeNotesInvoker = async (noteIds: string[]): Invoker => {
  const oldUser = userStore.getState().user;
  if (!oldUser) throw Error("No user");
  const result = await invokeWrapper(
    "notes/remove",
    oldUser.username,
    oldUser.password,
    noteIds
  );
  const { error, message } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  return result;
};
