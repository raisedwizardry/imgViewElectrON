const { app, BrowserWindow } = require('electron')

let win
app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

function createWindow () {
    win = new BrowserWindow({
        icon: "src/img/imgViewON.png",
        frame: false,
        resizable: false,
        fullscreen: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            additionalArguments: ["src/img/sample1.jpg"]
        }
    })

    win.loadFile('index.html')

    win.webContents.openDevTools({ mode: 'detach' })
    win.on('closed', () => { win = null })
}
