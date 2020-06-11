const currentUrl = 'http://localhost:3000';

/* Record and send a post command for every new action
1. Console log different actions
    a. New url entered
    b. New tab opened
    c. Tab closed

2. POST the action to the server

*/

$(document).ready(() => {
    var currentToken = Cookies.get('token');
    console.log("[BACKGROUND] Loaded page", Cookies.get('token'));
    
    let currentWindowId;
    chrome.windows.getCurrent((activeWindow) => {
        console.log(activeWindow);
        currentWindowId = activeWindow.id;
    });
    
    // Listener for cookies
    chrome.runtime.onMessage.addListener((request, sender) => {
        if(request.source === "popup") {
            console.log("[BACKGROUND][COOKIES] : ",request, Cookies.get('token'));
            currentToken = Cookies.get('token');
        }
        if(currentToken) {
            // Filtering out tab values not in the active window
            // Named callback for the event listener so it can be removed later
            console.log("[BACKGROUND] Adding listener for tabs");
            chrome.tabs.onUpdated.addListener(tabUpdates = (tabId, changeInfo, activeTab) => {
                if(changeInfo.status === "complete" && activeTab.windowId == currentWindowId) {
                    if(activeTab.url == "chrome://newtab/") { // New tab -- Specific to Brave browser?
                        console.log("New Tab");
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
        } else {
            console.log("[BACKGROUND] Removed listener for Tabs");
            chrome.tabs.onUpdated.removeListener(tabUpdates);
        }
    });
});


function actionPostApi(currentToken, dataObj) {
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
}