/*code to initate the window */
var gui = require('nw.gui');
var win = gui.Window.get();
global.imgpath;

//retrieve the image name and path from original opening give error if applicable
var arg=gui.App.argv;
var arglen=arg.length;

if (arglen === 1) {
	global.imgpath=arg[0];
}

else if (arglen > 1) {
   	global.imgpath=arg[0];
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

/*fires when a new image is opened as the first image is being viewed*/
gui.App.on('open', function (cmdline) {
// Break out the params from the command line and Get the last match and split on spaces   	
   	global.imgpath = (function () { return; })();
   	var arr = /(.*)--original-process-start-time\=(\d+)(.*)/.exec(cmdline);
	var params = arr.pop().split(' ');
	var parlen= params.length;
   	if (parlen===4){
		global.imgpath=params[3];
		var new_win = gui.Window.open ('new.html', {
			width : 0,
			height : 0, 
			icon   : "imgViewr.png",
			toolbar : false,
			frame  : false,
			resizable : false,
			postion : 'center',
			fullscreen: false,
			transparent: true
		});
   	}
   	else if (parlen>4) {
   		global.imgpath=params[3];
   		var new_win = gui.Window.open ('new.html', {
			width : 0,
			height : 0, 
			icon   : "imgViewr.png",
			toolbar : false,
			frame  : false,
			resizable : false,
			postion : 'center',
			fullscreen: false,
			transparent: true
		});
   		alert("Error: One image at a time");
   	}
   	else {
   		alert("Error: Could not access image");
   	}
});
