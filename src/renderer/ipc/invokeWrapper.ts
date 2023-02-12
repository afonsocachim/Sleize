import { ApprovedChannel } from "main/ipc/errorWrapper";
import { toast } from "react-toastify";
import { userStore } from "renderer/store/userStore";
import { ipcRenderer } from "./ipcRenderer";

export const invokeWrapper = async <T extends any[]>(
  channel: string,
  ...args: T
) => {
  const result: { error: boolean; message: string; data: any } =
    await ipcRenderer.invoke(channel, ...args);
  const { error, message, data } = result;
  if (typeof error !== "boolean") throw Error("Ipc error was not boolean");
  if (typeof message !== "string") throw Error("Ipc message was not string");
  // This is because if not passed data should null
  if (typeof data === "undefined") throw Error("Data is undefined");
  return result;
};

export type Invoker = Promise<{
  error: boolean;
  message: string;
  data: any;
}>;

type FailureResult = {
  error: true;
  message: string;
  data: null;
};

type SuccessResult<T> = {
  error: false;
  message: string;
  data: T;
};

type InvokeResult<T> = SuccessResult<T> | FailureResult;

export const approvedInvokeWrapper = async <K extends keyof ApprovedChannel>(
  channel: K,
  ...args: Parameters<ApprovedChannel[K]>
) => {
  const oldUser = userStore.getState().user;
  if (!oldUser) throw Error("No user");
  const result: InvokeResult<ReturnType<ApprovedChannel[K]>> =
    await ipcRenderer.invoke(
      channel,
      oldUser.username,
      oldUser.password,
      ...args
    );
  const { error, message } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  return result;
};
