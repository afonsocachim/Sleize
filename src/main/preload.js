const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    async invoke(channel, ...args) {
      const result = await ipcRenderer.invoke(channel, ...args);
      return result;
    },
    on(channel, ...args) {
      ipcRenderer.on(channel, ...args);
    },
  },
});

// invoke(channel, func) {
//   // Deliberately strip event as it includes `sender`
//   ipcRenderer.invoke(channel, (event, ...args) => func(...args));
// },
// on(channel, func) {
//   // Deliberately strip event as it includes `sender`
//   ipcRenderer.on(channel, (event, ...args) => func(...args));
// },
