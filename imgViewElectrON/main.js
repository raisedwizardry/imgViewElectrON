const { app, BrowserWindow } = require('electron');

let win;

app.on('ready', ()=> {
    let arg = process.argv.slice(1);
    
    for (var file in arg)
    {
        createWindow(arg[file]);
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

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
