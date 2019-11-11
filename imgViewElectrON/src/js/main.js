const { app, BrowserWindow, dialog } = require('electron');
const fs = require("fs");
const pa = require('path');
let win;
let Paths = [];
let app_ready = false;

app.releaseSingleInstanceLock()

app.on('will-finish-launching', function() { 
    app.on('open-file', function(event, path) {
        event.preventDefault();
        //dialog.showErrorBox("Error", path);
        if (!app_ready) {
            Paths.push(path);
        };
        if (app_ready) {
            Paths.length = 0;
            Paths.push(path);
            setupFileArgs();
        };
    });    
});

app.on('ready', () => {
    //dialog.showErrorBox("Error", "ready");
    app_ready = true;
    setupFileArgs();
});

app.on('window-all-closed', () => { app.quit(); });

function setupFileArgs(path) {
    if (Paths.length === 0) {
        Paths = process.argv.slice(determineArgStartFilePath());
        //dialog.showErrorBox("Error", Paths.toString());
    }
    if (Paths.length === 0) {
        dialog.showErrorBox("Error", "No image to display");
        checkForFileExistance(determineErrorImage());
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

function checkForFileExistance(imgFilePath) {
    if (fs.existsSync(imgFilePath)) {
        createWindow(imgFilePath);
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
    if (!imgFilePath.startsWith("--")) { return true; }
    else { return false; }
}

function checkForMacPsnFilePath(imgFilePath) {
    if (!imgFilePath.startsWith("-psn")) { return true; }
    else { return false; }
}

function checkForValidFilePath(imgFilePath) {
    if (checkForMacPsnFilePath(imgFilePath) && checkForDebugFilePath(imgFilePath) && checkForAcceptedFileEndings(imgFilePath)) {
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

function createWindow(imgFilePath) {
    win = new BrowserWindow({
        icon: "build/icon.png",
        frame: false,
        resizable: false,
        fullscreen: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            additionalArguments: [ imgFilePath ]
        }
    });

    win.loadFile('index.html');
    //win.webContents.openDevTools({ mode: 'detach' });
    win.on('closed', () => { win = null; });
}
