function ready (fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready (function () {
    if (isDev()) { document.getElementById('body').style.backgroundImage = 'url(assets/base.png' }
    const sizeOf = require('image-size');    
    AddRightClickClosing();
    let imagePath = process.argv[process.argv.length-1];
    //console.log(imagePath);
    let dimensions = sizeOf(imagePath);
    let theImageInfo = CreateImageInfoObject(dimensions.width, dimensions.height);
    let initialImageDetail = DetermineImgDetail(imagePath, theImageInfo);
    InitializeImage(initialImageDetail);
    AddHandle(theImageInfo.imageRatio, 'container');
});

function CreateImageInfoObject(origWidth, origHeight){
    let imageInfo = {
        "origImageWidth": origWidth,
        "origImageHeight": origHeight,
        "imageRatio": origWidth/origHeight,
        "screenWidth": window.screen.availWidth,
        "screenHeight": window.screen.availHeight
    }
    //console.log(imageInfo);
    return imageInfo;
}

function DetermineImgDetail(imageSource, theImageInfo) {
    let resizedWidth = DetermineInitialSizeByWidth(theImageInfo);
    let resizedHeight = FindMissingDimension(resizedWidth, 'wide', theImageInfo.imageRatio)
    let imgDetail = {
        "source": imageSource,
        "initialWidth": resizedWidth,
        "initialHeight": resizedHeight,
        "widthPosition": RandomPosition(theImageInfo.screenWidth, resizedWidth), 
        "heightPosition": RandomPosition(theImageInfo.screenHeight, resizedHeight)
    }
    //console.log(imgDetail);
    return imgDetail;
}

function DetermineInitialSizeByWidth(imageObject) {
    let resizedImageWidth;
    if (IsImageLargerThanScreen(imageObject)) {
        if (IsImageWiderAndHigherThanScreen(imageObject)) {
            let screenSizeScale = 0.9 * Math.min(imageObject.screenWidth/imageObject.origImageWidth, imageObject.screenHeight/imageObject.origImageHeight);
            resizedImageWidth = screenSizeScale * imageObject.origImageWidth;
        }
        else {
            if (IsImageWiderThanScreen(imageObject)) {
                resizedImageWidth = 0.9 * imageObject.screenWidth;
            }    
            else {
                let height = 0.9 * imageObject.screenHeight;
                resizedImageWidth = FindMissingDimension(height,'high',imageObject.imageRatio);
            }
        }
    }
    else {
        resizedImageWidth = imageObject.origImageWidth;
    }
    return resizedImageWidth;
}

function IsImageLargerThanScreen(imageObject) {
    if (imageObject.origImageWidth > imageObject.screenWidth) {
        return true;
    }
    else if (imageObject.origImageHeight > imageObject.screenHeight) {
        return true;
    }
    else {
        return false;
    }
}

function IsImageWiderAndHigherThanScreen(imageObject) {
    if ((imageObject.origImageWidth > imageObject.screenWidth) && (imageObject.origImageHeight > imageObject.screenHeight)) 
        return true;
    else
        return false;
}

function IsImageWiderThanScreen(imageObject) {
    if (imageObject.origImageWidth > imageObject.screenWidth)
        return true;
    else
        return false;
}

function FindMissingDimension(distance, highOrWide, ratio) {
    if (highOrWide === 'wide') {
        return distance / ratio;
    }
    else if (highOrWide === 'high') {
        return distance * ratio;
    }
}

function RandomPosition(whole, offset) {
    let max = whole - offset;
    let min = 1;
    return Math.floor(Math.random()*(max-min+1)+min);
}

function InitializeImage(imageDetailObject) {
    img = new Image();
    img.id = "main";
    img.src = imageDetailObject.source;
    document.getElementById('container').prepend(img);
    window.resizeTo(imageDetailObject.initialWidth, imageDetailObject.initialHeight);
    window.moveTo(imageDetailObject.widthPosition, imageDetailObject.heightPosition);
}

function AddRightClickClosing() {
    window.document.getElementById("container").addEventListener("mouseup", function(event) { 
        if (event.which === 3) { //right mouse
            window.close();
        }
    })
}

function isDev() {
    return process.mainModule.filename.indexOf('app.asar') === -1;
}