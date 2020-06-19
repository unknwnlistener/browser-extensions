
handleMouseClick = (event) => {
    try {
        console.log("Event before sending", event);
        chrome.runtime.sendMessage({source: 'target', mouse: {pageX: event.pageX, pageY: event.pageY}});
    } catch(e) {
        console.log("Chrome V engine problems");
    }
  
    // console.log("In target page", event);
}


// JQUERY $(document).ready(() =>{})
function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
        document.addEventListener('click', handleMouseClick);
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(() => {
    try {
        document.removeEventListener('click', handleMouseClick);
    }catch(e) {
        console.log("Cannot remove");
    }
});