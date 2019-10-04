const { app, BrowserWindow, dialog } = require('electron');
const { ipcMain } = require('electron');
const fs = require("fs");
let win;
let Paths = [];

ipcMain.on('ready-for-file', (event, data) => {
    if (data === "none") { event.reply('file-opened', {filePath: 'src/img/sizing.png'}); }
    else { event.reply('file-opened', {filePath: Paths[data]}); }
});

app.on('open-file', (event, path) => {
    event.preventDefault();
    Paths.push(path);
});

app.on('ready', ()=> { setupFileArgs(); });

app.on('window-all-closed', () => { app.quit(); });

function setupFileArgs() {
    if (Paths.length === 0) {
        let sliceAmount = determineArgStartFilePath();
        Paths = process.argv.slice(sliceAmount);
    }
    if (Paths.length === 0) {
        dialog.showErrorBox("Error", "No image to display");
        createWindow("none");
    }
    else if (Paths.length > 0) {
        for (let file in Paths) {
            if (checkForValidArgs(Paths[file])) {
                checkForFileExistance(Paths[file], file)
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

function validFilePath(imgFilePath) {
    if ((/\.(gif|jpg|jpeg|jpe|jif|jfi|jfif|webp|bmp|svg|svgz|png)$/i).test(imgFilePath)) {
        return true;
    }
    else { 
        dialog.showErrorBox("Error", "File format not supported");
        return false;
    }
}

function notDebugArgFilePath(imgFilePath) {
    if (!imgFilePath.startsWith("--inspect=5858")) { return true; }
    else { return false; }
}

function notMacPsnArgFilePath(imgFilePath) {
    if (!imgFilePath.startsWith("-psn")) { return true; }
    else { return false; }
}

function checkForValidArgs(imgFilePath) {
    if (validFilePath(imgFilePath) && notDebugArgFilePath(imgFilePath) && notMacPsnArgFilePath(imgFilePath)) {
        return true;
    }
    else { return false; }
}

function determineArgStartFilePath() {
    if (process.defaultApp) { sliceAmount = 2; }
    else { sliceAmount = 1; }
    return sliceAmount
}

function createWindow(fileNumber) {
    win = new BrowserWindow({
        icon: "src/img/imgViewElectrON.png",
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
