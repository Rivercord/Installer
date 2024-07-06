const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("node:path");
const fs = require("original-fs");
const cp = require("child_process");

function createWindow() {
  const win = new BrowserWindow({
    width: 450,
    height: 250,
    transparent: true,
    backgroundColor: "#00000000",
    frame: false,
    title: "Rivercord Installer",
    autoHideMenuBar: true,
    resizable: false,
    maximizable: false,
    minimizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    }
  });

  ipcMain.on(":localPaths", (event, arg) => {
    let p = app.getPath("appData");
    event.returnValue = {
      appData: p,
      localAppData: path.resolve(p, "..", "Local"),
    };
  });

  ipcMain.on(":pathExists", (event, arg) => {
    event.returnValue = fs.existsSync(arg);
  });

  ipcMain.on(":joinPaths", (event, arg) => {
    event.returnValue = path.join(...arg);
  });

  ipcMain.on(":readdir", (event, arg) => {
    try {
      event.returnValue = fs.readdirSync(arg, { encoding: "utf-8" });
    } catch (e) {
      console.error(e);
      event.returnValue = [];
    }
  });

  ipcMain.on(":writeFile", (event, arg) => {
    try {
      fs.writeFileSync(arg.path, arg.data, { encoding: "utf-8" });
      event.returnValue = true;
    } catch (e) {
      console.error(e);
      event.returnValue = false;
    }
  });

  ipcMain.on(":rm", (event, arg) => {
    try {
      fs.rmSync(arg, { recursive: true });
      event.returnValue = true;
    } catch (e) {
      console.error(e);
      event.returnValue = false;
    }
  });

  ipcMain.on(":rename", (event, arg) => {
    try {
      fs.renameSync(arg.oldPath, arg.newPath);
      event.returnValue = true;
    } catch (e) {
      console.error(e);
      event.returnValue = false;
    }
  });

  ipcMain.on(":mkdir", (event, arg) => {
    try {
      if (fs.existsSync(arg)) {
        event.returnValue = true;
        return;
      }
      fs.mkdirSync(arg, { recursive: true });
      event.returnValue = true;
    } catch (e) {
      event.returnValue = false;
    }
  });

  ipcMain.on(":exec", (event, arg) => {
    try {
      cp.execSync(arg);
      event.returnValue = true;
    } catch (e) {
      console.error(e);
      event.returnValue = false;
    }
  });

  ipcMain.on(":spawn", (event, arg) => {
    try {
      cp.spawn(arg.command, arg.args, arg.options);
      event.returnValue = true;
    } catch (e) {
      console.error(e);
      event.returnValue = false;
    }
  });

  win.loadFile(path.join(__dirname, "web/index.html"));
}

app.whenReady().then(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  createWindow()
})