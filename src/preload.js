const { contextBridge, ipcRenderer } = require("electron");

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
      },
      writeFile(path, data) {
        return ipcRenderer.sendSync(":writeFile", { path, data });
      },
      rm(path) {
        return ipcRenderer.sendSync(":rm", path);
      },
      rename(oldPath, newPath) {
        return ipcRenderer.sendSync(":rename", { oldPath, newPath });
      },
      mkdir(path) {
        return ipcRenderer.sendSync(":mkdir", path);
      }
    },
    childProcess: {
      exec(command) {
        return ipcRenderer.sendSync(":exec", command);
      },
      spawn(command, args = []) {
        return ipcRenderer.sendSync(":spawn", { command, args });
      }
    }
  }
);