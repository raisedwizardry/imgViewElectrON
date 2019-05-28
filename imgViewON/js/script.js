function ready (fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready (function () {
    const fs = require('fs');
    let rawdata = fs.readFileSync('imgFilePath.json')
    let imagePath = JSON.parse(rawdata);
    console.log(imagePath.filePath);
    const sizeOf = require('image-size');
    let dimensions = sizeOf(imagePath.filePath);
    let imageRatio = dimensions.width / dimensions.height;
    let theImageInfo = CreateImageInfoObject(dimensions.width, dimensions.height);
    let initialImageDetail = DetermineImgDetail(imagePath.filePath, theImageInfo);
    let container = document.getElementById('container');
    AddImageSource(initialImageDetail);
    
//    let resizeBot = document.getElementById('bottom-handle');
//    resizeBot.addEventListener('mousedown', initResize, false);
    
//    let resizeRight = document.getElementById('right-handle');
//    resizeRight.addEventListener('mousedown', initResize, false);
    
    let resizeBotRight = document.getElementById('bottomright-handle');
    resizeBotRight.addEventListener('mousedown', InitResizeBotRight, false);
});

function CreateImageInfoObject(origWidth, origHeight){
    let imageInfo = {
        "origImageWidth": origWidth,
        "origImageHeight": origHeight,
        "imageRatio": origWidth/origHeight,
        "screenWidth": window.screen.availWidth,
        "screenHeight": window.screen.availHeight
    }
    return imageInfo
}

function IsImageLargerThanScreen(imageObject) {
    if (imageObject.origImageWidth > imageObject.screenWidth) {
        return true
    }
    else if (imageObject.origImageHeight > imageObject.screenHeight) {
        return true
    }
    else {
        return false
    }
}

function DetermineInitialSpot() {

}

function DetermineInitialSizeByWidth(imageObject, resizeBool) {
    let resizedImageWidth
    if (resizeBool) {
        if ((imageObject.origImageWidth > imageObject.screenWidth) && (imageObject.origImageHeight > imageObject.screenHeight)) {
            if (imageObject.origImageHeight > imageObject.origImageWidth) {
                let height = 0.8 * imageObject.screenHeight;
                resizedImageWidth = FindMissingDimension(height,'high',imageObject.imageRatio);
            }    
            else {
                resizedImageWidth = 0.8 * imageObject.screenWidth;
            }
        }
        else if (imageObject.origImageWidth > imageObject.screenWidth) {
            resizedImageWidth = 0.8 * imageObject.screenWidth;
        }
        else if (imageObject.origImageHeight > imageObject.screenHeight) {
            let height = 0.8 * imageObject.screenHeight;
            resizedImageWidth = FindMissingDimension(height,'high',imageObject.imageRatio);
        }
    }
    else {
        resizedImageWidth = imageObject.origImageWidth;
    }
    console.log(resizedImageWidth);
    return resizedImageWidth
}

function DetermineImgDetail(imageSource, theImageInfo) {
    let resizeImage = IsImageLargerThanScreen(theImageInfo);
    let resizedWidth = DetermineInitialSizeByWidth(theImageInfo, resizeImage);
    let imgDetail = {
        "source": imageSource,
        "initialWidth": resizedWidth,
        "initialHeight": FindMissingDimension(resizedWidth, 'wide', theImageInfo.imageRatio)
    }
    console.log(imgDetail.initialHeight);
    return imgDetail
}

function FindMissingDimension(distance, highOrWide, ratio) {
    if (highOrWide==='wide') {
        let missed = distance/ratio;
        return missed;
    }
    else if (highOrWide==='high') {
        let missed = distance*ratio;
        return missed;
    }
}

function AddImageSource(imageDetailObject) {
    img = new Image();
    img.id = "main";
    img.src = imageDetailObject.source;
    container.prepend(img);
    window.resizeTo(imageDetailObject.initialWidth, imageDetailObject.initialHeight);
}

function InitResizeBotRight(e) {
    window.addEventListener('mousemove', ResizeBotRight, false);
    window.addEventListener('mouseup', StopResizeBotRight, false);
}

function ResizeBotRight(e) {
    container.style.width = (e.clientX - container.offsetLeft) + 'px';
    container.style.height = FindMissingDimension((e.clientX - container.offsetLeft), 'high', imageRatio) + 'px';

    window.resizeTo((e.clientX - container.offsetLeft),FindMissingDimension(e.clientX - container.offsetLeft,'high', imageRatio));
}

function StopResizeBotRight(e) {
    window.removeEventListener('mousemove', ResizeBotRight, false);
    window.removeEventListener('mouseup', StopResizeBotRight, false);
}
