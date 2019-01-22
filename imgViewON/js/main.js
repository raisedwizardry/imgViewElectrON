global.imgFilePath;
var nw = require('nw.gui');
var windowObject = {
	icon: "../img/imgViewON.png",
	frame: false,
	resizable: false,
	fullscreen: false,
	transparent: true
};
let args=nw.App.argv;
console.log(args);
nw.Window.open('../index.html', windowObject, function(win) {
	imgFilePath = FindFilePath(args);
	ValidateFilePath(imgFilePath)
	win.showDevTools();
	win.on('loaded', () => {
    	global.imgFilePath = imgFilePath;
  	});
});

nw.App.on('open', function(args) {
	console.log(args);
	var fileArguments = SubsequentFilePath(args);
	console.log(fileArguments);
	nw.Window.open('../index.html', windowObject, function(win) {
		win.showDevTools();
		var imgFilePath = FindFilePath(fileArguments);
		ValidateFilePath(imgFilePath);
		console.log(imgFilePath);
		win.on('loaded', () => {
    		global.imgFilePath = imgFilePath;
  		});
	});
});

function FindFilePath(arg) {
	let arglen=args.length;
	var imgpath;
	if (arglen === 1) {
		imgpath=args[0];
	}
	else if (arglen > 1) {
	   	imgpath=args[0];
	   	alert("Error: One image at a time");
	}
	else if (arglen === 0) {
		imgpath='../img/sizing.png'
		alert("Error: No image to display");
	}
	else {
		alert("Error: Could not access image");
		win.close();
	}
	return imgpath;
}

function SubsequentFilePath(args) {
	var fileArguments = /(.*)--original-process-start-time\=(\d+)(.*)/.exec(args).pop().split(' ');
	fileArguments.shift();
	fileArguments.shift();
	return fileArguments;
}

function ValidateFilePath(imgPath) {
	if ((/\.(gif|jpg|jpeg|jpe|jif|jfi|jfif|webp|bmp|svg|svgz|png)$/i).test(imgPath)) {}
	else {
		alert("Error: this file format not supported");
		win.close();
	}
}