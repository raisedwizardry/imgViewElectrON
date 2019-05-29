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
    let theImageInfo = CreateImageInfoObject(dimensions.width, dimensions.height);
    let initialImageDetail = DetermineImgDetail(imagePath.filePath, theImageInfo);
    AddImageSource(initialImageDetail);
    AddHandles(theImageInfo.imageRatio);
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

function randomPosition(whole, offset) {
    let max = whole - offset
    let min = 1
    return Math.floor(Math.random()*(max-min+1)+min);
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
    let resizedHeight = FindMissingDimension(resizedWidth, 'wide', theImageInfo.imageRatio)
    let imgDetail = {
        "source": imageSource,
        "initialWidth": resizedWidth,
        "initialHeight": resizedHeight,
        "widthPosition": randomPosition(theImageInfo.screenWidth, resizedWidth), 
        "heightPosition": randomPosition(theImageInfo.screenHeight, resizedHeight)
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
    window.moveTo(imageDetailObject.widthPosition, imageDetailObject.heightPosition);
}

function AddHandles(ratio) {
    let container = document.getElementById('container');
    document.getElementById('bottom-handle').addEventListener('mousedown', initResizeBot, false);
    document.getElementById('right-handle').addEventListener('mousedown', initResize, false);
    document.getElementById('bottomright-handle').addEventListener('mousedown', initResize, false);

    function initResize(e) {
        window.addEventListener('mousemove', Resize, false);
        window.addEventListener('mouseup', stopResize, false);
    }
    function Resize(e) {
        console.log(container.style.width, container.style.height);
        container.style.width = e.clientX + 'px';
        container.style.height = FindMissingDimension(e.clientX, "wide", ratio) + 'px';
        window.resizeTo(e.clientX, FindMissingDimension(e.clientX, "wide", ratio));
        console.log(ratio);
    }
    function stopResize(e) {
        window.removeEventListener('mousemove', Resize, false);
        window.removeEventListener('mouseup', stopResize, false);
    }
    function initResizeBot(e) {
        window.addEventListener('mousemove', resizeBot, false);
        window.addEventListener('mouseup', stopResizeBot, false);
    }
    function resizeBot(e) {
        console.log(container.style.width, container.style.height);
        container.style.width = FindMissingDimension(e.clientY, "high", ratio) + 'px';
        container.style.height = e.clientY + 'px';
        window.resizeTo(FindMissingDimension(e.clientY, "high", ratio), e.clientY);
        console.log(ratio);
    }
    function stopResizeBot(e) {
        window.removeEventListener('mousemove', resizeBot, false);
        window.removeEventListener('mouseup', stopResizeBot, false);
    }
}
