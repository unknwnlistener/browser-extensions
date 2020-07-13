'use strict';

var globalBuffer = [];
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
            keystrokeDelay: 10000
        }
        document.removeEventListener('click', handleMouseClick);
        document.addEventListener('click', handleMouseClick);
        keyMapper(options);

        window.setInterval(() => {
            if(globalBuffer && globalBuffer.length != 0) {
                console.log("Buffer check active", globalBuffer, Date.now());
                // chrome.runtime.sendMessage({source: 'keyboard', data: local.buffer})
                globalBuffer = [];
            }
        }, options.keystrokeDelay); // 10 seconds
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

    let scope = {
        buffer: [],
        lastKeyTime: Date.now()
    }
    document.addEventListener(eventType, (event) => {
        const key = event.key;
        try {
            // chrome.runtime.sendMessage({source: 'keyboard', keys: {keys: "abcde"}});
            // letters, numbers and spaces individually
            if(!(/^[\w\d\s]$/g.test(key))) return;

            globalBuffer = [];
            const currentTime =  Date.now();
            
            if(currentTime - scope.lastKeyTime > keystrokeDelay) {
                globalBuffer = [key];
            } else {
                globalBuffer = [...scope.buffer, key];
            }
            
            scope = {buffer: globalBuffer, lastKeyTime: currentTime};
            console.log(globalBuffer);
        } catch(e) {
            console.log("Chrome V keyboard problems");
        }
    });

    
}

function hasProperty(property, object) {
    return object && object.hasOwnProperty(property);
}

// Handle page change send whatever is in buffer