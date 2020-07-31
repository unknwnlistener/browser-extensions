'use strict';

var globalBuffer = [];
var globalLastKeyTime = Date.now();
var listener;
var intervalId;

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
        fn();
    } else {
        document.addEventListener('readystatechange', event => {
            if(event.target.readyState != 'loading') {
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
            let configDelay = hasProperty('actions', config) && hasProperty('keystrokes', config.actions) && hasProperty('delay', config.actions.keystrokes) ? +config.actions.keystrokes.delay : 5000
            document.removeEventListener('click', handleMouseClick);
            document.addEventListener('click', handleMouseClick);
            // keyMapper(options);
            document.removeEventListener('keydown', handleKeyboardInput);
            document.addEventListener('keydown', handleKeyboardInput);   

            const delay = configDelay >= 300 && configDelay;
            const keystrokeDelay = delay || 5000;
            // Logic: Every second check if the last key time (global) was longer than the delay time ago. If it was than send what is in the buffer and reset it
            intervalId = window.setInterval(() => {
                if(globalBuffer && globalBuffer.length != 0 && (Date.now() - globalLastKeyTime > keystrokeDelay)) {
                    sendBufferData();
                }
            }, 1000); // 1 seconds
        });

    } catch(e) {
        console.warn("Cannot remove event listener", e);
        if(intervalId) window.clearInterval(intervalId);
    }
});

function handleMouseClick(event) {
    try {
        chrome.runtime.sendMessage({source: 'target', mouse: {pageX: event.pageX, pageY: event.pageY}});
    } catch(e) {
        console.warn("Chrome engine server issue");
        removeAllEventListeners();
    }
}

function keyMapper() {
    document.removeEventListener('keydown', handleKeyboardInput);
    document.addEventListener('keydown', handleKeyboardInput);   
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
        console.warn("Chrome keyboard issue");
        removeAllEventListeners();
    }
}

function sendBufferData() {
    if(globalBuffer && globalBuffer.length != 0) {
        try {
            chrome.runtime.sendMessage({source: 'keyboard', data: globalBuffer});
        } catch(e) {
            console.warn("Chrome shut down");
            if(intervalId) window.clearInterval(intervalId);
        } finally {
            globalBuffer = [];
        }
    }
}

function hasProperty(property, object) {
    return object && object.hasOwnProperty(property);
}

function removeAllEventListeners() {
    document.removeEventListener('click', handleMouseClick);
    document.removeEventListener('keydown', handleKeyboardInput);
}