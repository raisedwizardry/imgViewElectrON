const { app, BrowserWindow, dialog } = require('electron');
const fs = require("fs");
const is = require('electron-is');
let win;
let macPath;

app.on('ready', ()=> { setupFileArgs(); });

app.on('will-finish-launching', () => {
    app.on('open-file', (event, path) => {
        event.preventDefault();
        macPath = path;
    });
});

//app.on('activate', () => { setupFileArgs(); });

app.on('window-all-closed', () => { app.quit(); });

function setupFileArgs() {
    let arg
    if (is.windows())
    {
        let sliceAmount = determineArgStartFilePath();
        arg = process.argv.slice(sliceAmount);
    }
    if ((is.windows() && (arg.length === 0)) || (is.macOS() && !macPath)) {
        dialog.showErrorBox("Error", "No image to display");
        createWindow("src/img/sizing.png");
    }
    else if ((is.windows && (arg.length > 0)) || (is.macOS() && macPath)) {
        if (is.windows() && checkForFileExistance()) {
            for (let file in arg) {
                if (checkForFileExistance(arg[file])) {
                    renderWindow(arg[file])
                }
            }
        }
        else if (is.macOS()) {
            if (checkForFileExistance(macPath)) {
                renderWindow(macPath);
                macPath = null;
            }
        }
    }
    else {
        dialog.showErrorBox("Error", "Could not access image");
    }
}

function checkForFileExistance(imgFilePath) {
    if (fs.existsSync(imgFilePath)) {
        return true;
    }
    else {
        dialog.showErrorBox("Error", "Image does not exist in path given");
        createWindow("src/img/sizing.png");
        return false;
    }
}

function renderWindow(imgFilePath) {
    if (notDebugArgFilePath(imgFilePath) && notMacPsnArgFilePath(imgFilePath) && validFilePath(imgFilePath)) {
        createWindow(imgFilePath);
    }
}

function determineArgStartFilePath() {
    if (process.defaultApp) {
        sliceAmount = 2;
    }
    else {
        sliceAmount = 1;
    }
    return sliceAmount
}

function notDebugArgFilePath(imgFilePath) {
    if (!imgFilePath.startsWith("--inspect=5858")) {
        return true;
    }
    else { 
        return false;
    }
}

function notMacPsnArgFilePath(imgFilePath) {
    if (!imgFilePath.startsWith("-psn")) {
        return true;
    }
    else { 
        return false;
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

function createWindow(imgFilePath) {
    win = new BrowserWindow({
        icon: "src/img/imgViewON.png",
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
    win.on('closed', () => { win = null });
}
