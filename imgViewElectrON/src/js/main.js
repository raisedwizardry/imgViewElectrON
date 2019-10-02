const { app, BrowserWindow, dialog } = require('electron');
const { ipcMain } = require('electron');
const fs = require("fs");
const is = require('electron-is');
let win;
let Paths = [];

ipcMain.on('ready-for-file', (event, data) => {
    if (data === "none") { event.reply('file-opened', {filePath: 'src/img/sizing.png'}); }
    else { event.reply('file-opened', {filePath: Paths[data]}); }
});

app.on('ready', ()=> { setupFileArgs(); });

app.on('will-finish-launching', () => {
    app.on('open-file', (event, path) => {
        event.preventDefault();
        Paths.push(path);
        setupFileArgs();
    });
});

app.on('activate', () => { setupFileArgs(); });

app.on('window-all-closed', () => { app.quit(); });

function setupFileArgs() {
    if (is.windows()) {
        let sliceAmount = determineArgStartFilePath();
        Paths = process.argv.slice(sliceAmount);
    }
    if (Paths.length === 0) {
        dialog.showErrorBox("Error", "No image to display");
        createWindow("none");
    }
    else if (Paths.length > 0) {
        if (is.windows()) {
            for (let file in Paths) {
                if (checkForValidArgs(Paths[file])) {
                    checkForFileExistance(Paths[file], file)
                }
            }
        }
        else if (is.macOS()) {
            if (checkForValidArgs(Paths[0])) {
                checkForFileExistance(Paths[0], 0);
            }
        }
    }
    else {
        dialog.showErrorBox("Error", "Could not access image");
    }
}

function checkForFileExistance(imgFilePath, argNumber) {
    if (fs.existsSync(imgFilePath)) {
        createWindow(argNumber);
    }
    else {
        dialog.showErrorBox("Error", `Image Path Given: ${imgFilePath} does not exist in path given`);
    }
}

function checkForValidArgs(imgFilePath) {
    if (notDebugArgFilePath(imgFilePath) && notMacPsnArgFilePath(imgFilePath) && validFilePath(imgFilePath)) {
        return true;
    }
    else { return false; }
}

function determineArgStartFilePath() {
    if (process.defaultApp) { sliceAmount = 2; }
    else { sliceAmount = 1; }
    return sliceAmount
}

function notDebugArgFilePath(imgFilePath) {
    if (!imgFilePath.startsWith("--inspect=5858")) { return true; }
    else { return false; }
}

function notMacPsnArgFilePath(imgFilePath) {
    if (!imgFilePath.startsWith("-psn")) { return true; }
    else { return false; }
}

function validFilePath(imgFilePath) {
    if ((/\.(gif|jpg|jpeg|jpe|jif|jfi|jfif|webp|bmp|svg|svgz|png)$/i).test(imgFilePath)) {
        return true;
    }
    else { 
        dialog.showErrorBox("Error", "File format not supported");
        return false;
    }
}

function createWindow(fileNumber) {
    win = new BrowserWindow({
        icon: "src/img/imgViewON.png",
        frame: false,
        resizable: false,
        fullscreen: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            additionalArguments: [ fileNumber ]
        }
    });

    win.loadFile('index.html');
    //win.webContents.openDevTools({ mode: 'detach' });
    win.on('closed', () => { win = null; });
}
