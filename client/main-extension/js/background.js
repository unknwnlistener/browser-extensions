const currentUrl = 'http://localhost:3000';

/* Record and send a post command for every new action
1. Console log different actions
    a. New url entered
    b. New tab opened
    c. Tab closed

2. POST the action to the server

*/
var currentWindowId;
var currentToken = Cookies.get('token');
var currentConfig = JSON.parse(Cookies.get('config'));

let isSetListeners = false;

$(document).ready(() => {
    console.log("[BACKGROUND] Loaded page", Cookies.get('token'), Cookies.get('config'));
    
    chrome.windows.getCurrent((activeWindow) => {
        console.log(activeWindow);
        currentWindowId = activeWindow.id;
    });

    // User already logged in
    if (currentToken) {
        addTabListeners();
    }
    
    // Listener for cookies
    chrome.runtime.onMessage.addListener((request, sender) => {
        if(request.source === "popup") {
            currentToken = Cookies.get('token');
            currentConfig = JSON.parse(JSON.stringify(request.config));
            console.log("[BACKGROUND][COOKIES] : ",request, Cookies.get('token'), currentConfig);
        }
        if(currentToken) {
            addTabListeners();
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
    let isValidAction = currentConfig.actions[dataObj['action']];
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
            if(changeInfo.status === "complete" && activeTab.windowId == currentWindowId) {
                if(activeTab.url == "chrome://newtab/") { // New tab -- Specific to Brave browser?
                    dataObj = {
                        action: 'tab_opened',
                        tabId: tabId,
                        windowId: currentWindowId
                    }
                    actionPostApi(currentToken, dataObj);
                } else { // Url updated
                    // Info to store -- url, tabId, windowId
                    // console.log("TabId : ",tabId);
                    // console.log("Change Info: ",changeInfo);
                    // console.log("Active Tab : ", activeTab);
                    dataObj = {
                        action: 'url',
                        tabId: tabId,
                        url: activeTab.url,
                        windowId: currentWindowId
                    }
                    actionPostApi(currentToken, dataObj);
                }
            }
        });
        chrome.tabs.onRemoved.addListener(tabRemoved = (tabId, removeInfo) => {
            dataObj = {
                action: 'tab_closed',
                tabId: tabId,
                windowId: currentWindowId
            }
            actionPostApi(currentToken, dataObj);
        });
    }
}