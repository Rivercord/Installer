const { app, contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
  "API",
  {
    paths: ipcRenderer.sendSync(":localPaths"),
    utils: {
      joinPaths(...paths) {
        return ipcRenderer.sendSync(":joinPaths", paths);
      },
      exists(path) {
        return ipcRenderer.sendSync(":pathExists", path);
      }
    }
  }
);