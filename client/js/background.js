const currentUrl = 'http://localhost:3000';
// const currentUrl = 'https://ancient-coast-51172.herokuapp.com'; 

/* Record and send a post command for every new action
1. Console log different actions
    a. New url entered
    b. New tab opened
    c. Tab closed
    d. Mouse click location in page (excluding screenshot for now)
    e. Keymapper
    f. Desktop capture

2. POST the action to the server

*/
var currentWindowId;
var currentToken = Cookies.get('token');
var currentConfig;
// let configCookie = Cookies.get('config');
// var currentConfig = configCookie ? JSON.parse(configCookie) : configCookie;
var activeTabList = [];

let isSetListeners = false;

$(document).ready(() => {
    console.log("[BACKGROUND] Loaded page", Cookies.get('token'), Cookies.get('config'));

    // chrome.windows.getCurrent((activeWindow) => {
    //     currentWindowId = activeWindow.id;
    // });

    // User already logged in
    if (currentToken) {
        readConfig();
        addTabListeners();
    }

    // Listener for cookies
    chrome.runtime.onMessage.addListener((request, sender, res) => {
        if (Cookies.get('token')) {
            // readConfig();
            if (request.source === "popup") {
                console.log("[BACKGROUND][COOKIES] : ", request, Cookies.get('token'), Cookies.get('config'));
                currentToken = Cookies.get('token');
                readConfig();
                addTabListeners();
            } else if (request.source === "target") {
                let mouseEvent = request.mouse;
                console.log("[MESSAGE SEND] Mouse event sent", request);

                dataObj = {
                    action: 'mouse_click',
                    tabId: sender.tab.id,
                    url: sender.tab.url,
                    windowId: sender.tab.windowId,
                    mouse_x: mouseEvent.pageX,
                    mouse_y: mouseEvent.pageY
                }
                actionPostApi(currentToken, dataObj);
            } else if (request.source === "keyboard") {
                let keyEvent = request.data;
                console.log("Keyboard event recorded ", request, keyEvent.join(' '));
                dataObj = {
                    action: 'keystrokes',
                    tabId: sender.tab.id,
                    url: sender.tab.url,
                    windowId: sender.tab.windowId,
                    keys: keyEvent.join(' ')
                }
                actionPostApi(currentToken, dataObj);
            }
        } else {
            removeTabListeners();
        }
    });
});

function removeTabListeners() {
    try {
        console.log("[BACKGROUND] Removed listener for Tabs");
        chrome.tabs.onUpdated.removeListener(tabUpdates);
        chrome.tabs.onRemoved.removeListener(tabRemoved);
    } catch(e) {
        console.warn("Listeners not yet added");
    } finally {
        isSetListeners = false;
    }
}


function actionPostApi(currentToken, dataObj) {
    dataObj['client_timestamp'] = Date.now();
    let isValidAction = checkEnabledAction(dataObj['action']);
    if (isValidAction) {
        console.log("[CONFIG] CURRENT ACTION TO RECORD ", dataObj['action'], currentToken);
        $.ajax({
            url: `${currentUrl}/api/users/actions`,
            type: "POST",
            headers: {
                'Authorization': `Bearer ${currentToken}`,
            },
            data: dataObj,
            success: (data) => {
                console.log("[ACTION][POST] Successful", data);
            },
            error: (err) => {
                console.error("[ACTION]{POST} Unsuccesful ", err);
            }
        });
    } else {
        console.log("[CONFIG] NOT RECORDING ACTION %s", dataObj['action']);
    }
}

function checkEnabledAction(action) {
    let currentConfig = JSON.parse(Cookies.get('config'));
    return currentConfig && (currentConfig.hasOwnProperty("actions") && currentConfig.actions.hasOwnProperty(action) && currentConfig.actions[action].hasOwnProperty("active") ? currentConfig.actions[action]["active"].toString() === "true" : false);
}


function addTabListeners() {
    // Named callback for the event listener so that the listener can be removed later
    if (!isSetListeners) {
        console.log("[BACKGROUND] Adding listener for tabs");
        isSetListeners = true;
        chrome.tabs.onUpdated.addListener(tabUpdates = (tabId, changeInfo, activeTab) => {
            // if (activeTab.windowId == currentWindowId) {
            if (changeInfo.status === "complete") {
                if (activeTab.url == "chrome://newtab/") { // New tab -- Specific to Brave browser?
                    let dataObj = {
                        action: 'tab_opened',
                        tabId: tabId,
                        windowId: activeTab.windowId
                    }
                    actionPostApi(currentToken, dataObj);
                } else if (activeTab.url && (activeTab.url.startsWith('https://') || activeTab.url.startsWith('http://'))) {
                    // Info to store -- url, tabId, windowId
                    let dataObj = {
                        action: 'url',
                        tabId: tabId,
                        url: activeTab.url,
                        windowId: activeTab.windowId
                    }
                    addDeviceEventListeners(tabId, activeTab.windowId, activeTab.url);
                    actionPostApi(currentToken, dataObj);
                    //[TODO] Temporarily disabled
                    // capturePageScreenshot(tabId, activeTab.windowId, activeTab.url);
                }
            }
            // }
        });
        chrome.tabs.onRemoved.addListener(tabRemoved = (tabId, removeInfo) => {
            // if (removeInfo.windowId == currentWindowId) {
                let dataObj = {
                    action: 'tab_closed',
                    tabId: tabId,
                    windowId: removeInfo.windowId
                }
                actionPostApi(currentToken, dataObj);
            // }
        });

    }
}

function addDeviceEventListeners(tabId, windowId, url) {
    // if(!activeTabList.includes(tabId)) {
    //     activeTabList.push(tabId);
    //     // IDEA: Instead of listenening to every active tab being highlighted, what if listeners were added to every new URL. This way even if the user is on the same tab and continues surfing, mouseclick listeners will always be present.
        // Mouseclick event gets reset when a new url is navigated to in the same tab

        // TEST -- Change urls on the same page and see how many listeners get added
        chrome.tabs.executeScript(tabId, { file: './js/pageEventListeners.js' }, () => {
            console.log("[CALLBACK] Injected script in other page");
        });
    // }
}

function capturePageScreenshot(tabId, windowId, url) {
    // let dataObj = {
    //     tabId: tabId,
    //     windowId: windowId,
    //     url: url
    // }
    let imageFormat = 'jpeg';
    // chrome.browserAction.onClicked.addListener((tab)=> console.log("[DEBUG] TABSSS", tab));
    console.log("[DEBUG] Capturing Screenshot...");
    chrome.tabs.captureVisibleTab(windowId, { format: imageFormat }, (image) => {
        // console.log("Capturing screenshot", image);
        if (image) saveImage(image, imageFormat);
    });
    // window.scrollTo(0,200);

}

function saveBlobAsFile(blob, fileName) {
    let reader = new FileReader();
    reader.readAsDataURL(blob);

    reader.onload = function () {
        var base64 = reader.result;
        console.log("Image base64: ", base64);
        var link = document.createElement("a");

        document.body.appendChild(link); // for Firefox

        link.setAttribute("href", base64);
        link.setAttribute("download", fileName);
        link.click();
    };

}

function saveImage(image, format) {
    let link = document.createElement("a");
    link.download = filename(format);
    link.href = image;
    link.click();

    URL.revokeObjectURL(link.href);

}
function filename(format) {
    var pad = (n) => (n = n + '', n.length >= 2 ? n : `0${n}`)
    var ext = (format) => format === 'jpeg' ? 'jpg' : format === 'png' ? 'png' : 'png'
    var timestamp = (now) =>
        [pad(now.getFullYear()), pad(now.getMonth() + 1), pad(now.getDate())].join('-')
        + ' - ' +
        [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join('-')
    return `Screenshot Capture - ${timestamp(new Date())}.${ext(format)}`
}

function readConfig() {
    $.ajax({
        url: `${currentUrl}/api/config`,
        type: "GET",
        headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        success: (data) => {
            let config = {};
            if(data.status) {
                config.actions = JSON.parse(JSON.stringify(data.data));
            }
            Cookies.set('config', config, {expires: 1});
            chrome.storage.sync.set({'config': config}, function() {
                console.log("[BG] Chrome storage value is set to ", config);
            });
        },
        error: (e) => {
            if(e.status != 403)
                console.error("Could not read config", e);
            else
                console.warn("Forbidden", e);
        }
    });
}