const { app, BrowserWindow, dialog } = require('electron');
const is = require('electron-is');
let win;

app.on('ready', ()=> { setupFileArgs(); });
app.on('open-file', (event, path) => {  
    event.preventDefault();
    renderWindow(path); 
});
app.on('activate', () => { setupFileArgs(); });

app.on('window-all-closed', () => { app.quit(); });

function setupFileArgs() {
    let sliceAmount = determineArgStartFilePath();
    let arg = process.argv.slice(sliceAmount);
    if ((arg.length === 0) || is.macOS()) {
        dialog.showErrorBox("Error", "No image to display");
        createWindow("src/img/sizing.png");
    }
    else if(arg.length > 0) {
        for (let file in arg) {
            renderWindow(arg[file])
        }
    }
    else {
        dialog.showErrorBox("Error", "Could not access image");
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
