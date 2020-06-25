
handleMouseClick = (event) => {
    try {
        console.log("Event before sending", event);
        chrome.runtime.sendMessage({source: 'target', mouse: {pageX: event.pageX, pageY: event.pageY}});
    } catch(e) {
        console.log("Chrome V engine problems");
    }
  
    // console.log("In target page", event);
}

keyMapper = (options) => {
    const delay = hasProperty('keystrokeDelay', options) && options.keystrokeDelay >= 300 && options.keystrokeDelay;
    const keystrokeDelay = delay || 1000;
    const eventType = hasProperty('eventType', options) && options.eventType || 'keydown';

    let local = {
        buffer: [],
        lastKeyTime: Date.now()
    }
    document.addEventListener(eventType, (event) => {
        const key = event.key;
        try {
            // chrome.runtime.sendMessage({source: 'keyboard', keys: {keys: "abcde"}});
            // letters, numbers and spaces individually
            if(!(/^[\w\d\s]$/g.test(key))) return;

            let buffer = []
            const currentTime =  Date.now();
            
            if(currentTime - local.lastKeyTime > keystrokeDelay) {
                chrome.runtime.sendMessage({source: 'keyboard', data: local.buffer})
                buffer = [key];
            } else {
                buffer = [...local.buffer, key];
            }
            
            local = {buffer: buffer, lastKeyTime: currentTime};
            console.log(buffer);
        } catch(e) {
            console.log("Chrome V keyboard problems");
        }
    });

    
}
hasProperty = (property, object) => {
    return object && object.hasOwnProperty(property);
}


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
            keystrokeDelay: 1000
        }
        document.removeEventListener('click', handleMouseClick);
        document.addEventListener('click', handleMouseClick);
        keyMapper(options);
    }catch(e) {
        console.log("Cannot remove", e);
    }
});