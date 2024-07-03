const { app, contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
  "API",
  {
    paths: ipcRenderer.sendSync(":localPaths"),
    utils: {
      joinPaths(...paths) {
        return ipcRenderer.sendSync(":joinPaths", paths);
      }
    },
    fs: {
      exists(path) {
        return ipcRenderer.sendSync(":pathExists", path);
      },
      readdir(path) {
        return ipcRenderer.sendSync(":readdir", path);
      }
    }
  }
);