'use strict';

var globalBuffer = [];
var globalLastKeyTime = Date.now();
var listener;


// JQUERY -- $(document).ready(() =>{})
// function ready(fn) {
//     if (document.readyState != 'loading'){
//         fn();
//     } else {
//         document.removeEventListener('DOMContentLoaded', fn);
//         document.addEventListener('DOMContentLoaded', fn);
//     }
// }
function ready(fn) {
    if(document.readyState != 'loading') {
        console.log("Page load complete");
        fn();
    } else {
        document.addEventListener('readystatechange', event => {
            if(event.target.readyState != 'loading') {
                console.log("Page load after listening");
                fn();
            }
        })
    }
}

ready(() => {
    try {
        // chrome.runtime.sendMessage({source: 'config'}, (res) => { //Wait for config response
        chrome.storage.sync.get(['config'], function(result) {
            let config = result ? result.config: {};
            globalBuffer = [];
            const options = {
                eventType: 'keydown',
                keystrokeDelay: hasProperty('actions', config) && hasProperty('keystrokes', config.actions) && hasProperty('delay', config.actions.keystrokes) ? +config.actions.keystrokes.delay : 5000
            }
            document.removeEventListener('click', handleMouseClick);
            document.addEventListener('click', handleMouseClick);
            keyMapper(options);
            const delay = hasProperty('keystrokeDelay', options) && options.keystrokeDelay >= 300 && options.keystrokeDelay;
            const keystrokeDelay = delay || 5000;
            // Logic: Every second check if the last key time (global) was longer than the delay time ago. If it was than send what is in the buffer and reset it
            window.setInterval(() => {
                if(globalBuffer && globalBuffer.length != 0 && (Date.now() - globalLastKeyTime > keystrokeDelay)) {
                    console.log("Buffer check active", globalBuffer, Date.now());
                    sendBufferData();
                }
            }, 1000); // 1 seconds
        });

    } catch(e) {
        console.warn("Cannot remove event listener", e);
    }
});

function handleMouseClick(event) {
    try {
        console.log("Event before sending", event);
        chrome.runtime.sendMessage({source: 'target', mouse: {pageX: event.pageX, pageY: event.pageY}});
    } catch(e) {
        console.warn("Chrome V engine problems");
    }
}

function keyMapper(options) {
    const eventType = hasProperty('eventType', options) && options.eventType || 'keydown';
    document.removeEventListener(eventType, handleKeyboardInput);
    document.addEventListener(eventType, handleKeyboardInput);   
}

function handleKeyboardInput(event) {
    let key = event.key;
    try {
        // Logic: Special names to store special keys. Can be added to based on requirement
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
        }
        
        const currentTime =  Date.now();
        globalBuffer = [...globalBuffer, key];
        globalLastKeyTime = currentTime;
        if(event.keyCode === 13) { // Return/Enter key
            sendBufferData();
        }
    } catch(e) {
        console.warn("Chrome V keyboard problems");
    }
}

function sendBufferData() {
    if(globalBuffer && globalBuffer.length != 0) {
        console.log("Sending buffer to main", globalBuffer);
        chrome.runtime.sendMessage({source: 'keyboard', data: globalBuffer});
        globalBuffer = [];
    }
}

function hasProperty(property, object) {
    return object && object.hasOwnProperty(property);
}