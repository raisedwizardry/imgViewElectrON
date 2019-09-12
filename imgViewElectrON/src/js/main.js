const { app, BrowserWindow } = require('electron');
let win;

app.on('ready', ()=> { loopArgs() } );
app.on('open-file', () => {
    if (win === null) {
        loopArgs();
    }
});
app.on('activate', () => {
    if (win === null) {
        loopArgs();
    }
});


app.on('window-all-closed', () => { app.quit(); });

function loopArgs() {
    let arg = process.argv.slice(1);
    for (var file in arg)
    {
        if (!arg[file].startsWith("--"))
        {
            if (!(arg[file] === "."))
            {
                createWindow(arg[file]);
            }
        }
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
