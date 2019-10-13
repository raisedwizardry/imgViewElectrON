const { app, BrowserWindow, dialog } = require('electron');
const { ipcMain } = require('electron');
const fs = require("fs");
const pa = require('path');
let win;
let Paths = [];
let app_ready = false;

ipcMain.on('ready-for-file', (event, data) => {
    
    if (Paths[data] === "opened.kill") { 
        event.reply('close-window');
    }
    else { 
        event.reply('file-opened', {filePath: Paths[data]}); 
        Paths.splice(data ,1 ,"opened.kill");
    }
    if (Paths.every(element => element === "opened.kill")){
        Paths.length = 0;
    }
});

app.releaseSingleInstanceLock()

app.on('will-finish-launching', function() { 
    app.on('open-file', function(event, path) {
        event.preventDefault();
        Paths.push(path);
        //dialog.showErrorBox("Error", Paths.toString());
        if (app_ready) {
            setupFileArgs();
        };
    });    
});

app.on('ready', () => {
    app_ready = true;
    setupFileArgs();
});

app.on('window-all-closed', () => { app.quit(); });

function setupFileArgs() {
    if (Paths.length === 0) {
        let sliceAmount = determineArgStartFilePath();
        Paths = process.argv.slice(sliceAmount);
    }
    if (Paths.length === 0) {
        dialog.showErrorBox("Error", "No image to display");
        let errorPath = determineErrorImage();
        Paths.push(errorPath);
        checkForFileExistance(errorPath, "0");
    }
    else if (Paths.length > 0) {
        for (let file in Paths) {
            if (checkForValidFilePath(Paths[file])) {
                checkForFileExistance(Paths[file], file);
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

function checkForAcceptedFileEndings(imgFilePath) {
    if ((/\.(gif|jpg|jpeg|jpe|jif|jfi|jfif|webp|bmp|svg|svgz|png)$/i).test(imgFilePath)) {
        return true;
    }
    else { 
        dialog.showErrorBox("Error", `File format not supported for ${imgFilePath}`);
        return false;
    }
}

function checkForDebugFilePath(imgFilePath) {
    if (!imgFilePath.startsWith("--inspect=")) { return true; }
    else { return false; }
}

function checkForMacPsnFilePath(imgFilePath) {
    if (!imgFilePath.startsWith("-psn")) { return true; }
    else { return false; }
}

function checkForAlreadyOpenFilePath(imgFilePath) {
    if (imgFilePath !== "opened.kill") { return true; }
    else { return false; }
}

function checkForValidFilePath(imgFilePath) {
    if (checkForAlreadyOpenFilePath(imgFilePath) && checkForMacPsnFilePath(imgFilePath) && checkForDebugFilePath(imgFilePath) && checkForAcceptedFileEndings(imgFilePath)) {
        return true;
    }
    else { return false; }
}

function determineArgStartFilePath() {
    if (isDev()) { sliceAmount = 2; }
    else { sliceAmount = 1; }
    return sliceAmount;
}

function determineErrorImage() {
    let errorImage;
    if (isDev()) { errorImage = 'assets/sizing.png'; }
    else { errorImage = '../../assets/sizing.png'; }
    errorImage = pa.resolve(app.getAppPath() ,errorImage);
    return errorImage;
}

function isDev() {
    return process.mainModule.filename.indexOf('app.asar') === -1;
}

function createWindow(fileNumber) {
    win = new BrowserWindow({
        icon: "build/icon.png",
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
