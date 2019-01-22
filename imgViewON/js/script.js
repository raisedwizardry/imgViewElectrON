/*code to initate the window */
var nw = require('nw.gui');
var win = nw.Window.get();
global.imgpath;
let arg=nw.App.argv;
FindFilePath(arg);
win.showDevTools()
//win.clearCache()

//retrieve the image name and path from original opening give error if applicable
function FindFilePath(arg) {
	let arglen=arg.length;
	if (arglen === 1) {
		global.imgpath=arg[0];
	}
	else if (arglen > 1) {
	   	global.imgpath=arg[0];
	   	//gui.Window.open('../index.html', {}, function(win) {});
	   	alert("Error: One image at a time");
	}
	else if (arglen === 0) {
		global.imgpath='../img/sizing.png'
		alert("Error: No image to display");
	}
	else {
		alert("Error: Could not access image");
		win.close();
	}
}
//nw.Window.open('../index.html', {}, function(win) {});

/*fires when a new image is opened as the first image is being viewed*/
