const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("node:path");
const fs = require("fs");

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
      event.returnValue = [];
    }
  });

  win.loadFile(path.join(__dirname, "web/index.html"));
}

app.whenReady().then(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  createWindow()
})