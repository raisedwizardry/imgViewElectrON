/*define functions*/
//find width or height given a length and give the the oposite based on the aspect ratio
//aspect ratio is width divided by height
function missing(length, highwide, ratio) {
    if (highwide==='wide') {
        var missed = length/ratio;
        return missed;
    }
    else if (highwide==='high') {
        var missed = length*ratio;
        return missed;
    }
}
//number generator within a max and min interval
function intgen(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}
//validate the source image and close properly if not an image file
function valimgsrc(imgsrc) {
    if ((/\.(gif|jpg|jpeg|jpe|jif|jfi|jfif|webp|bmp|svg|svgz|png)$/i).test(imgsrc)) {
    }
    else {
        alert("Error: this file format not supported");
        win.close();
    }
}
//create an image and add the id and source to the new image
function addimgsrc() {
    img= new Image();
    img.id="main";
    img.src=global.imgpath;
    return img;
}
//initial sizing of image based on the screen size also moves and resizes window
function firstimgresize(img) {
    var origimgwidth=$(img).prop('naturalWidth');
    var origimgheight=$(img).prop('naturalHeight');
    var origimgratio=origimgwidth/origimgheight;
    var origscreenwidth=window.screen.width;
    var origscreenheight=window.screen.height;
//determine appropriate width and height based on screen width and image width     
    if (origscreenwidth>=1920) {
        if (origimgwidth<135) {
            wide=136;
            high=missing(wide, 'wide', origimgratio);    
        }
        else if (origimgwidth<1199) {
            wide=origimgwidth;
            high=origimgheight;
        }
        else {
            wide=1200;
            high=missing(wide, 'wide', origimgratio);    
        }
    }
    else if (origscreenwidth>=1600) { 
        if(origimgwidth<135) {
            wide=136;
            high=missing(wide, 'wide', origimgratio);    
        }
        else if (origimgwidth<899) {
            wide=origimgwidth;
            high=origimgheight;
        }
        else {
            wide=900;
            high=missing(wide, 'wide', origimgratio);
        }
    }
    else if (origscreenwidth>=1200) {
        if(origimgwidth<135) {
            wide=136;
            high=missing(wide, 'wide', origimgratio);    
        }
        else if (origimgwidth<699) {
            wide=origimgwidth;
            high=origimgheight;
        }
        else {
            wide=700;
            high=missing(wide, 'wide', origimgratio);
        }
    }
    else if (origscreenwidth>=800) {
        if(origimgwidth<135) {
            wide=136;
            high=missing(wide, 'wide', origimgratio);    
        }
        else if (origimgwidth<499) {
            wide=origimgwidth;
            high=origimgheight;
        }
        else {
            wide=500;
            high=missing(wide, 'wide', origimgratio);
        }
    }
    else {
        if(origimgwidth<135) {
            wide=136;
            high=missing(wide, 'wide', origimgratio);    
        }
        else if (origimgwidth>=399) {
            wide=origimgwidth;
            high=origimgheight;
        }
        else {
            wide=300;
            high=missing(wide, 'wide', origimgratio);
        }
    }
//ensure height is appropriate based on screen height and the new width determined height
    if (origscreenheight>=1024) {
        if (high>900) {
            high=900;
            wide=missing(high, 'high', origimgratio);
        }
        else if (high < 100) {
            high=100;
            wide=missing(high, 'high', origimgratio);
        }
    }
    else if (origscreenheight<1024) {
        if (high>900){
            high=600;
            wide=missing(high, 'high', origimgratio);
        }
        else if (high < 100) {
            high=100;
            wide=missing(high, 'high', origimgratio);
        }
    }
//give the image the determined width and height   
    img.width=wide;
    img.height=high;
//move window to random spot within range on screen
    window.moveTo(intgen(100,200), intgen(100,150));
//resize window to determined width and height 
    window.resizeTo(wide, high);  
//return the ratio of the image for future jquery-ui resizing
    return origimgratio;
}
//jquery-ui code that allows image resizes using side handles and adds helper/ghost images
function uisize(origimgratio) {
    $('#dadresize').resizable({
        ghost: true,
        helper: "resizable-helper",
        aspectRatio: origimgratio,
        handles: {
            'e': '#right-handle',
            'se': '#bottomright-handle',
            's': '#bottom-handle'
        }
    });
}

/*start of javascript code*/
$(document).ready(function() {
    var theimg;
    valimgsrc(global.imgpath);
    theimg=addimgsrc();
    
    $(theimg).load(function() {
        var ratio=firstimgresize(theimg);
        $('#dadresize').prepend(theimg);
        uisize(ratio);
    });

    $('#dadresize').on('resize', function( event, ui ) {
            window.resizeTo(ui.size.width, ui.size.height);  
    });

    $('#dadresize').mouseup(function(eve) {
        if (eve.which === 3) {//right mouse
            win.close(); 
        }
    });
});