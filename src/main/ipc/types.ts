import { IpcRenderer } from "electron";

export type IpcRendererType = {
  on: IpcRenderer["on"];
  invoke: IpcRenderer["invoke"];
};
