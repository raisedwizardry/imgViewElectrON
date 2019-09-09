function AddHandle(ratio, elementId) {
    let container = document.getElementById(elementId); //,
        //timeout = false, // holder for timeout id
        //delay = 250; // delay after event is "complete" to run callback
    document.getElementById('bottom-handle').addEventListener('mousedown', initResizeBot, false);
    document.getElementById('right-handle').addEventListener('mousedown', initResize, false);
    document.getElementById('bottomright-handle').addEventListener('mousedown', initResize, false);

    function initResize(e) {
        window.addEventListener('mousemove', Resize, false);
        window.addEventListener('mouseup', stopResize, false);
    }
    function Resize(e) {
        container.style.width = e.clientX + 'px';
        container.style.height = e.clientX / ratio + 'px';
        window.resizeTo(e.clientX, e.clientX / ratio);
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
        container.style.width = e.clientY * ratio + 'px';
        container.style.height = e.clientY + 'px';
        window.resizeTo(e.clientY * ratio, e.clientY);
    }
    function stopResizeBot(e) {
        window.removeEventListener('mousemove', resizeBot, false);
        window.removeEventListener('mouseup', stopResizeBot, false);
    }
}