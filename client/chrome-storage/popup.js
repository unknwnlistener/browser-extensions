"use strict";

chrome.tabs.getCurrent(function(tab){
    console.log(tab.url);
});