var nw = require('nw.gui');
const fs = require('fs');
let windowObject = {
	icon: "../img/imgViewON.png",
	frame: false,
	resizable: false,
	fullscreen: false,
	transparent: true
};

let fileArguments=nw.App.argv;
nw.Window.open('../index.html', windowObject, function(win) {
	SetUpWindow(fileArguments, win);
});

nw.App.on('open', function(cmdline) {
	let fileArguments = SubsequentFilePath(cmdline);
	nw.Window.open('../index.html', windowObject, function(win) {
		SetUpWindow(fileArguments, win);
	});
});

function SetUpWindow(fileArguments, win) {
	//win.showDevTools();
	let filePath = FindFilePath(fileArguments, win);
	filePath = RemoveExtraQuotes(filePath);
	ValidateFilePath(filePath, win);
	WriteToJson(filePath);
	AddRightClickClosing(win);
}


function FindFilePath(arg, windowObject) {
	let arglen=arg.length;
	let imgPath;
	if (arglen === 1) {
		imgPath = arg[0];
		return imgPath;
	}
	else if (arglen > 1) {
		imgPath = arg[0];
		alert("Error: One image at a time");
		return imgPath;
	}
	else if (arglen === 0) {
		imgPath = "../img/sizing.png";
		alert("Error: No image to display");
		return imgPath;
	}
	else {
		alert("Error: Could not access image");
		windowObject.close();
	}
}

function RemoveExtraQuotes(imgPath) {
	if (imgPath.charAt(0) === '"' && imgPath.charAt(imgPath.length -1) === '"') {
		return imgPath.substr(1,imgPath.length -2);
	}
	else {
		return imgPath;
	}
}

function ValidateFilePath(imgPath, windowObject) {
	if ((/\.(gif|jpg|jpeg|jpe|jif|jfi|jfif|webp|bmp|svg|svgz|png)$/i).test(imgPath)) {}
	else {
		alert("Error: File format not supported");
		windowObject.close();
	}
}

function WriteToJson(imgPath) {
	let data = {filePath: imgPath};
	let json = JSON.stringify(data, null, 2);
	fs.writeFileSync('imgFilePath.json', json);
}

function AddRightClickClosing(windowObject) {
	windowObject.on('loaded', function() {
		var doc = windowObject.window.document;
		doc.getElementById("dadresize").addEventListener("mouseup", function(event) { 
			if (event.which === 3) {//right mouse
				windowObject.close(); 
			}
			console.log("click");
		});
	});
}

function SubsequentFilePath(arg) {
	let fileArguments = /(.*)--original-process-start-time\=(\d+)(.*)/.exec(arg).pop().split(' ');
	fileArguments.shift();
	fileArguments.shift();
	return fileArguments;
}