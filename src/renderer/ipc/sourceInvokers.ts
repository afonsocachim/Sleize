import {
  BaseSource,
  Source,
  VideoSource,
  LocalPdfSource,
} from "main/database/schemas/sourceSchema";
import { toast } from "react-toastify";
import { sourceStore } from "renderer/store/sourceStore";
import { userStore } from "renderer/store/userStore";
import { Invoker, invokeWrapper } from "./invokeWrapper";

export const insertOnlineVideoInvoker = async (
  url: string,
  title: string
): Invoker => {
  const { user } = userStore.getState();
  if (!user) throw Error("No user");
  const result = await invokeWrapper(
    "sources/insert/online_video",
    user.username,
    user.password,
    url,
    title
  );
  return result;
};

export const insertArticleInvoker = async (
  url: string,
  title: string
): Invoker => {
  const { user } = userStore.getState();
  if (!user) throw Error("No user");
  const result = await invokeWrapper(
    "sources/insert/article",
    user.username,
    user.password,
    url,
    title
  );
  return result;
};

export const getPdfFileDataInvoker = async (
  pdfSource: LocalPdfSource
): Invoker => {
  const { user } = userStore.getState();
  if (!user) throw Error("No user");
  const result = await invokeWrapper(
    "sources/get/pdf_file_Data",
    user.username,
    user.password,
    pdfSource
  );
  const { error, message } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  return result;
};

export const getVideoAndSubBufferInvoker = async (
  videoSource: VideoSource
): Invoker => {
  const { user } = userStore.getState();
  if (!user) throw Error("No user");
  const result = await invokeWrapper(
    "sources/get/video_and_sub",
    user.username,
    user.password,
    videoSource
  );
  const { error, message } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  return result;
};

export const updateLocalSourcePathInvoker = async (
  oldSource: Source
): Invoker => {
  const { user } = userStore.getState();
  if (!user) throw Error("No user");
  const result = await invokeWrapper(
    "sources/update/local_path",
    user.username,
    user.password,
    oldSource
  );
  const { error, message, data } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  sourceStore.setState({ source: data });
  return result;
};

export const getSourceFromIdInvoker = async (id: string): Invoker => {
  const { user } = userStore.getState();
  if (!user) throw Error("No user");
  const result = await invokeWrapper(
    "sources/get/id",
    user.username,
    user.password,
    id
  );
  const { error, message, data } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  sourceStore.setState({ source: data });
  return result;
};

export const insertLocalPdfInvoker = async (): Invoker => {
  const { user } = userStore.getState();
  if (!user) throw Error("No user");
  const result = await invokeWrapper(
    "sources/insert/local_pdf",
    user.username,
    user.password
  );
  if (result.error) {
    toast.error(result.message);
  } else {
    toast.success(result.message);
  }
  return result;
};

export const insertLocalVideoInvoker = async (): Invoker => {
  const { user } = userStore.getState();
  if (!user) throw Error("No user");
  const result = await invokeWrapper(
    "sources/insert/local_video",
    user.username,
    user.password
  );
  if (result.error) {
    toast.error(result.message);
  } else {
    toast.success(result.message);
  }
  return result;
};

export const insertSourceInvoker = async (newSource: BaseSource): Invoker => {
  const { user } = userStore.getState();
  if (!user) throw Error("No user");
  const result = await invokeWrapper(
    "sources/insert",
    user.username,
    user.password,
    newSource
  );
  const { error, message } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  return result;
};

export const removeSourceInvoker = async (ids: string[]): Invoker => {
  const { user } = userStore.getState();
  if (!user) throw Error("No user");
  const result = await invokeWrapper(
    "sources/remove",
    user.username,
    user.password,
    ids
  );
  const { error, message } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  return result;
};

export const updateSourceInvoker = async (newSource: BaseSource): Invoker => {
  const { user } = userStore.getState();
  if (!user) throw Error("No user");
  const result = await invokeWrapper(
    "sources/update",
    user.username,
    user.password,
    newSource
  );
  const { error, message } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  return result;
};

export const updateAndSetSourceInvoker = async (
  newSource: BaseSource
): Invoker => {
  const result = await updateSourceInvoker(newSource);
  const { data, error } = result;
  if (error) return result;
  sourceStore.setState({ source: data });
  return result;
};
