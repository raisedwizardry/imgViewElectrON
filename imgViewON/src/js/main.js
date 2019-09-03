var nw = require('nw.gui');
const fs = require('fs');
let windowObject = {
    icon: "src/img/imgViewON.png",
    frame: false,
    resizable: false,
    fullscreen: false,
    transparent: true
};

let fileArguments = nw.App.argv;
//console.log(nw.App.argv);
//chrome.developerPrivate.openDevTools({renderViewId: -1, renderProcessId: -1, extensionId: chrome.runtime.id});
nw.Window.open('index.html', windowObject, function(win) {
    SetUpWindow(fileArguments, win);
});

nw.App.on('open', function(cmdline) {
    //console.log(cmdline);
    let fileArguments = SubsequentFilePath(cmdline);
    nw.Window.open('index.html', windowObject, function(win) {
        SetUpWindow(fileArguments, win);
    });
});

function SubsequentFilePath(arg) {
    let fileArguementString = ParseArguements(arg);
    console.log(fileArguementString);
    
    //return [ "src/img/sizing.png" ]
    fileArguementString = RemoveExtraQuotes(fileArguementString);
    let fileArguementArray = SplitForMultiplePictures(fileArguementString);
    console.log(fileArguementArray);
    return fileArguementArray;
}

function SetUpWindow(fileArguments, win) {
    //win.showDevTools();
    let filePath = FindFilePath(fileArguments, win);
    ValidateFilePath(filePath, win);
    WriteToJson(filePath);
    AddRightClickClosing(win);
}

function FindFilePath(arg, windowObject) {
    let arglen = arg.length;
    let imgPath;
    if (arglen === 1) {
        imgPath = arg[0];
        //console.log("happy path")
        return imgPath;
    }
    else if (arglen === 2 && arg[0].endsWith("imgViewON")) {
        imgPath = arg[1];
        //console.log("happy path on")
        return imgPath;
    }
    else if (arglen > 2 && arg[0].endsWith("imgViewON")) {
        imgPath = arg[1];
        alert("Error: One image at a time>2on")
        return imgPath;
    }
    else if (arglen > 1) {
        imgPath = arg[0];
        alert("Error: One image at a time >1");
        return imgPath;
    }
    else if (arglen === 0) {
        imgPath = "src/img/sizing.png";
        alert("Error: No image to display");
        return imgPath;
    }
    else {
        alert("Error: Could not access image");
        windowObject.close();
    }
}

function ParseArguements(arg) {
    let regex = /--original-process-start-time=\d+\s/;
    let fileArguments = arg.split(regex);
    fileArguments.shift();
    return fileArguments[0];
}

function RemoveExtraQuotes(imgPath) {
    if (imgPath.charAt(0) === '"' && imgPath.charAt(imgPath.length -1) === '"') {
        //console.log(imgPath);
        return imgPath.substr(1,imgPath.length -2);
    }
    else {
        return imgPath;
    }
}

function SplitForMultiplePictures(fileArguments) {
    let regex = /\"\s\"/;
    if (fileArguments.search(regex) != -1) {
        return fileArguments.split(regex);
    }
    else {
        let arguementArray = [];
        arguementArray.push(fileArguments);
        return arguementArray;
    }
}

function ValidateFilePath(imgPath, windowObject) {
    if ((/\.(gif|jpg|jpeg|jpe|jif|jfi|jfif|webp|bmp|svg|svgz|png)$/i).test(imgPath)) {}
    else {
        console.log("Error: File format not supported");
        windowObject.close();
    }
}

function WriteToJson(imgPath) {
    let data = {filePath: imgPath};
    let json = JSON.stringify(data, null, 4);
    fs.writeFileSync('imgFilePath.json', json);
}

function AddRightClickClosing(windowObject) {
    windowObject.on('loaded', function() {
        var doc = windowObject.window.document;
        doc.getElementById("container").addEventListener("mouseup", function(event) { 
            if (event.which === 3) {//right mouse
                windowObject.close(); 
            }
        });
    });
}
