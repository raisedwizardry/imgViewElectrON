var nw = require('nw.gui');
const fs = require('fs');
let windowObject = {
	icon: "../img/imgViewON.png",
	frame: false,
	resizable: false,
	fullscreen: false,
	transparent: true
};

let args=nw.App.argv;
nw.Window.open('../index.html', windowObject, function(win) {
	//win.showDevTools();
	let filePath = FindFilePath(args);
	filePath = RemoveExtraQuotes(filePath);
	ValidateFilePath(filePath);
	WriteToJson(filePath);
	AddRightClickClosing(win);
});

nw.App.on('open', function(cmdline) {
	let fileArguments = SubsequentFilePath(cmdline);
	nw.Window.open('../index.html', windowObject, function(win) {
		//win.showDevTools();
		let filePath = FindFilePath(fileArguments);
		filePath = RemoveExtraQuotes(filePath);
		ValidateFilePath(filePath);
		WriteToJson(filePath);
		AddRightClickClosing(win);
	});
});

function AddRightClickClosing(win) {
	win.on('loaded', function() {
		var doc = win.window.document;
		doc.getElementById("dadresize").addEventListener("mouseup", function(event) { 
			if (event.which === 3) {//right mouse
				win.close(); 
			}
			console.log("click");
		});
	});
}

function WriteToJson(path) {
	let data = {filePath: path};
	let json = JSON.stringify(data, null, 2);
	fs.writeFileSync('imgFilePath.json', json);
}

function FindFilePath(arg) {
	let arglen=args.length;
	let imgpath;
	if (arglen === 1) {
		imgpath = arg[0];
		return imgpath;
	}
	else if (arglen > 1) {
		imgpath = arg[0];
		alert("Error: One image at a time");
		return imgpath;
	}
	else if (arglen === 0) {
		imgpath = "../img/sizing.png";
		alert("Error: No image to display");
		return imgpath;
	}
	else {
		alert("Error: Could not access image");
		win.close();
	}
}

function SubsequentFilePath(args) {
	let fileArguments = /(.*)--original-process-start-time\=(\d+)(.*)/.exec(args).pop().split(' ');
	fileArguments.shift();
	fileArguments.shift();
	return fileArguments;
}

function RemoveExtraQuotes(imgPath) {
	if (imgPath.charAt(0) === '"' && imgPath.charAt(imgPath.length -1) === '"') {
		return imgPath.substr(1,imgPath.length -2);
	}
	else {
		return imgPath;
	}
}

function ValidateFilePath(imgPath) {
	if ((/\.(gif|jpg|jpeg|jpe|jif|jfi|jfif|webp|bmp|svg|svgz|png)$/i).test(imgPath)) {}
	else {
		alert("Error: File format not supported");
		win.close();
	}
}