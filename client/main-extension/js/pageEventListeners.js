'use strict';

var globalBuffer = [];
var globalLastKeyTime = Date.now();
var intervId;


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
        const options = {
            eventType: 'keydown',
            keystrokeDelay: 5000
        }
        document.removeEventListener('click', handleMouseClick);
        document.addEventListener('click', handleMouseClick);
        keyMapper(options);

        // Logic: Every 3 seconds check if the last key time (global) was longer than the delay time ago. If it was than send what is in the buffer and reset it
        window.setInterval(() => {
            if(globalBuffer && globalBuffer.length != 0 && (Date.now() - globalLastKeyTime > options.keystrokeDelay)) {
                console.log("Buffer check active", globalBuffer, Date.now());
                // chrome.runtime.sendMessage({source: 'keyboard', data: local.buffer})
                globalBuffer = [];
            }
        }, 1000); // 3 seconds
    }catch(e) {
        console.log("Cannot remove", e);
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

    document.addEventListener(eventType, (event) => handleKeyboardInput(event, keystrokeDelay) );   
}

function handleKeyboardInput(event, keystrokeDelay) {
    let scope = {
        buffer: [],
        lastKeyTime: Date.now()
    }
    
    const key = event.key;
    try {
        // chrome.runtime.sendMessage({source: 'keyboard', keys: {keys: "abcde"}});
        // letters, numbers and spaces individually
        if(!(/^[\w\d\s]$/g.test(key))) return; // Guard

        // globalBuffer = [];
        const currentTime =  Date.now();
        if(currentTime - scope.lastKeyTime > keystrokeDelay) {
            scope.buffer = [key];
        } else {
            scope.buffer = [...globalBuffer, key];
        }
        globalBuffer = scope.buffer;
        scope.lastKeyTime = currentTime;
        globalLastKeyTime = currentTime;
        // scope = {buffer: globalBuffer, lastKeyTime: currentTime};
    } catch(e) {
        console.log("Chrome V keyboard problems");
    }
}

function sendBufferData() {
    if(globalBuffer && globalBuffer.length != 0) {
        chrome.runtime.sendMessage({source: 'keyboard', data: globalBuffer})
        globalBuffer = [];
    }
}

function hasProperty(property, object) {
    return object && object.hasOwnProperty(property);
}

// Handle page change send whatever is in buffer