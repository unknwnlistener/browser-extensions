// Open a new tab with the url
chrome.browserAction.onClicked.addListener(function(activeTab)
{
    console.log("BACKGROUND : ", activeTab);
    var newURL = "http://www.youtube.com/watch?v=oHg5SJYRHA0";
    chrome.tabs.create({ url: newURL });
});