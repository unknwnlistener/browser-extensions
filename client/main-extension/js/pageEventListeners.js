'use strict';

var globalBuffer = [];
var globalLastKeyTime = Date.now();

// JQUERY $(document).ready(() =>{})
function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(() => {
    let currentConfig;
    chrome.storage.sync.get('config', (config) => {
        currentConfig = JSON.parse(config);
    });
    console.log("[DEBUG] CONFIG", currentConfig);
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
}

function handleKeyboardInput(event) {    
    const key = event.key;
    try {
        // letters, numbers and spaces individually
        if(event.keyCode === 13) { // Return/Enter key
            sendBufferData();
        }
        
        if(!(/^[\w\d\s]$/g.test(key))) return; // Guard
        const currentTime =  Date.now();
        globalBuffer = [...globalBuffer, key];
        globalLastKeyTime = currentTime;

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