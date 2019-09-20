const { app, BrowserWindow, dialog } = require('electron');
const is = require('electron-is');
let win;

app.on('ready', ()=> { renderWindow(); });
app.on('open-file', () => {  renderWindow(); });
app.on('activate', () => { renderWindow(); });


app.on('window-all-closed', () => { app.quit(); });

function renderWindow() {
    let sliceAmount;
    if (process.defaultApp) { sliceAmount = 2; }
    else { sliceAmount = 1; }
    let arg = process.argv.slice(sliceAmount);
    if (arg.length === 0) {
        dialog.showErrorBox("Error", "No image to display");
        createWindow("src/img/sizing.png");
    }
    else if(arg.length > 0) {
        for (let file in arg) {
            if (!arg[file].startsWith("--inspect=5858")) {
                if ((/\.(gif|jpg|jpeg|jpe|jif|jfi|jfif|webp|bmp|svg|svgz|png)$/i).test(arg[file])) {
                    createWindow(arg[file]);
                }
                else {
                    dialog.showErrorBox("Error", "File format not supported");
                }
            }
        }
    }
    else {
        dialog.showErrorBox("Error", "Could not access image");
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
    win.webContents.openDevTools({ mode: 'detach' });
    win.on('closed', () => { win = null });
}
