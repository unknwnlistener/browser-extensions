const currentUrl = 'http://localhost:3000';

/* Record and send a post command for every new action
1. Console log different actions
    a. New url entered
    b. New tab opened
    c. Tab closed
    d. Mouse click location in page (excluding screenshot for now)

2. POST the action to the server

*/
var currentWindowId;
var currentToken = Cookies.get('token');
var currentConfig = JSON.parse(Cookies.get('config'));
var deviceClickActiveTab;

let isSetListeners = false;

$(document).ready(() => {
    console.log("[BACKGROUND] Loaded page", Cookies.get('token'), Cookies.get('config'));
    
    chrome.windows.getCurrent((activeWindow) => {
        currentWindowId = activeWindow.id;
    });

    // User already logged in
    if (currentToken) {
        addTabListeners();
    }
    
    // Listener for cookies
    chrome.runtime.onMessage.addListener((request, sender) => {
        currentToken = Cookies.get('token');
        if(currentToken) {
            if(request.source === "popup") {
                currentConfig = JSON.parse(JSON.stringify(request.config));
                console.log("[BACKGROUND][COOKIES] : ",request, Cookies.get('token'), currentConfig);
                addTabListeners();
            } else if(request.source === "target") {
                let mouseEvent = request.mouse;
                console.log("[MESSAGE SEND] Mouse event sent", request);
                
                dataObj = {
                    action: 'mouse_click',
                    tabId: deviceClickActiveTab.tabId,
                    url: deviceClickActiveTab.url,
                    windowId: deviceClickActiveTab.windowId,
                    mouse_x: mouseEvent.pageX,
                    mouse_y: mouseEvent.pageY
                }
                // console.log("[REST] Sending mouse click data", dataObj);
                actionPostApi(currentToken, dataObj);
            } else if (request.source === "keyboard") {
                console.log("Keyboard event recorded ", request.data);
                let keyEvent = request.data;
                dataObj = {
                    action: 'keystrokes',
                    tabId: deviceClickActiveTab.tabId,
                    url: deviceClickActiveTab.url,
                    windowId: deviceClickActiveTab.windowId,
                    keys: keyEvent.join()
                }
                actionPostApi(currentToken, dataObj);
            }
        } else {
            console.log("[BACKGROUND] Removed listener for Tabs");
            chrome.tabs.onUpdated.removeListener(tabUpdates);
            chrome.tabs.onRemoved.removeListener(tabRemoved);
            isSetListeners = false;
        }
    });
});


function actionPostApi(currentToken, dataObj) {
    dataObj['client_timestamp'] = Date.now();
    let isValidAction = currentConfig.actions[dataObj['action']].toString();
    console.log("[CONFIG] CURRENT ACTION TO RECORD ", dataObj['action']);
    if(isValidAction && (isValidAction == "true")) {
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
                console.error(err);
            }
        });
    } else {
        console.log("[CONFIG] NOT RECORDING ACTION %s", dataObj['action']);
    }
}


function addTabListeners() {
    // Filtering out tab values not in the active window
    // Named callback for the event listener so it can be removed later
    if(!isSetListeners) {
        console.log("[BACKGROUND] Adding listener for tabs");
        isSetListeners = true;
        chrome.tabs.onUpdated.addListener(tabUpdates = (tabId, changeInfo, activeTab) => {
            if(activeTab.windowId == currentWindowId) {
                if(changeInfo.status === "complete") {
                    if(activeTab.url == "chrome://newtab/") { // New tab -- Specific to Brave browser?
                        dataObj = {
                            action: 'tab_opened',
                            tabId: tabId,
                            windowId: currentWindowId
                        }
                        actionPostApi(currentToken, dataObj);
                    } else if(activeTab.url && (activeTab.url.startsWith('https://') || activeTab.url.startsWith('http://'))) {
                        // Info to store -- url, tabId, windowId
                        dataObj = {
                            action: 'url',
                            tabId: tabId,
                            url: activeTab.url,
                            windowId: currentWindowId
                        }
                        addDeviceEventListeners(tabId, currentWindowId, activeTab.url);
                        actionPostApi(currentToken, dataObj);
                    }
                }
            }
        });
        // Tab closing
        chrome.tabs.onRemoved.addListener(tabRemoved = (tabId, removeInfo) => {
            if(removeInfo.windowId == currentWindowId) {
                dataObj = {
                    action: 'tab_closed',
                    tabId: tabId,
                    windowId: currentWindowId
                }
                actionPostApi(currentToken, dataObj);
            }
        });

    }
}

function addDeviceEventListeners(tabId, windowId, url) {
    // Mouseclick actions
    deviceClickActiveTab = { tabId: tabId, windowId: windowId, url: url };
    // IDEA: Instead of listenening to every active tab being highlighted, what if listeners were added to every new URL. This way even if the user is on the same tab and continues surfing, mouseclick listeners will always be present.
    // Mouseclick event gets reset when a new url is navigated to in the same tab
/*    // List of tabs already listened to
    let listenedTabs = [];
    chrome.tabs.onActivated.addListener((activeInfo) => {
        console.log("Adding more listeners?");
        mouseClickActiveTab = {
            action: 'mouse_click',
            tabId: activeInfo.tabId,
            windowId: activeInfo.windowId
        }
        if(!listenedTabs.includes(activeInfo.tabId)) {
            listenedTabs.push(activeInfo.tabId);
            chrome.tabs.get(activeInfo.tabId, (tab) => {
                if(tab.url && (tab.url.startsWith('https://') || tab.url.startsWith('http://'))) {
                    chrome.tabs.executeScript(activeInfo.tabId, {file: './js/pageEventListeners.js'}, () => {
                        console.log("[CALLBACK] Injected script in other page");
                    });
                }
            });
        }
    });
    */
    // TEST -- Change urls on the same page and see how many listeners get added
    chrome.tabs.executeScript(tabId, {file: './js/pageEventListeners.js'}, () => {
        console.log("[CALLBACK] Injected script in other page");
    });
}