'use strict';

var globalBuffer = [];
var globalLastKeyTime = Date.now();
var listener;

// JQUERY $(document).ready(() =>{})
function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(() => {
    try {
        globalBuffer = [];
        const options = {
            eventType: 'keydown',
            keystrokeDelay: 5000
        }
        document.removeEventListener('click', handleMouseClick);
        document.addEventListener('click', handleMouseClick);
        keyMapper(options);

        const delay = hasProperty('keystrokeDelay', options) && options.keystrokeDelay >= 300 && options.keystrokeDelay;
        const keystrokeDelay = delay || 1000;
        // Logic: Every second check if the last key time (global) was longer than the delay time ago. If it was than send what is in the buffer and reset it
        window.setInterval(() => {
            if(globalBuffer && globalBuffer.length != 0 && (Date.now() - globalLastKeyTime > keystrokeDelay)) {
                console.log("Buffer check active", globalBuffer, Date.now());
                sendBufferData();
            }
        }, 1000); // 1 seconds
    }catch(e) {
        console.log("Cannot remove event listener", e);
    }
});

function handleMouseClick(event) {
    try {
        console.log("Event before sending", event);
        chrome.runtime.sendMessage({source: 'target', mouse: {pageX: event.pageX, pageY: event.pageY}});
    } catch(e) {
        console.log("Chrome V engine problems");
    }
  
    // console.log("In target page", event);
}

function keyMapper(options) {
    const delay = hasProperty('keystrokeDelay', options) && options.keystrokeDelay >= 300 && options.keystrokeDelay;
    const keystrokeDelay = delay || 1000;
    const eventType = hasProperty('eventType', options) && options.eventType || 'keydown';
    document.removeEventListener(eventType, handleKeyboardInput)
    document.addEventListener(eventType, handleKeyboardInput);   

    // keyboardJS.bind('', (e) => {
    //     console.log(e.key, "key was pressed");
    // });
}

function handleKeyboardInput(event) {
    let key = event.key;
    try {
        switch(event.key) {
            case "Control":
                key = "Ctrl";
                break;
            case "Meta":
                key = "Command";
                break;
            case " ":
                key = "Space";
                break;
            // case "Enter":
            // case "Alt":
            // case "AltGraph":
            // case "Shift":
            // case "CapsLock":
            // case "Tab":
        }
        
        const currentTime =  Date.now();
        globalBuffer = [...globalBuffer, key];
        globalLastKeyTime = currentTime;
        if(event.keyCode === 13) { // Return/Enter key
            sendBufferData();
        }
    } catch(e) {
        console.log("Chrome V keyboard problems");
    }
}

function sendBufferData() {
    if(globalBuffer && globalBuffer.length != 0) {
        console.log("Sending buffer to main", globalBuffer);
        chrome.runtime.sendMessage({source: 'keyboard', data: globalBuffer})
        globalBuffer = [];
    }
}

function hasProperty(property, object) {
    return object && object.hasOwnProperty(property);
}