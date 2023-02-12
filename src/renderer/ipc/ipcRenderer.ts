import { IpcRendererType } from "main/ipc/types";

const win = window as any;
const { ipcRenderer: preType } = win.electron;
const ipcRenderer = preType as IpcRendererType;
export { ipcRenderer };
